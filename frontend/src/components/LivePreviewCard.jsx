import { useState, useEffect } from "react";
import { Desktop, Code } from "@phosphor-icons/react";
import { fetchAllRunFiles } from "../lib/api";
import { SandpackProvider, SandpackLayout, SandpackPreview } from "@codesandbox/sandpack-react";

export default function LivePreviewCard({ run }) {
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [viewMode, setViewMode] = useState("sandpack"); // "sandpack" or "iframe"

  const runId = run?.id;
  const tasksFilesHash = JSON.stringify(run?.tasks?.map(t => t.code_file_paths));

  useEffect(() => {
    let mounted = true;
    if (!runId || !tasksFilesHash) return;
    
    const hasFiles = run.tasks.some(t => t.code_file_paths && t.code_file_paths.length > 0);
    if (!hasFiles) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchAllRunFiles(runId)
      .then((data) => {
        if (!mounted) return;
        
        let isReact = false;
        const formattedFiles = {};
        
        // Determine the base folder name (e.g. '7th-heaven-bakery/') by finding the folder 
        // that actually contains src, public, package.json, or index.html
        const allPaths = Object.keys(data.files);
        let baseFolder = "";
        for (const p of allPaths) {
          if (p.includes("/src/") || p.includes("/public/") || p.endsWith("package.json") || p.endsWith("index.html")) {
            const parts = p.split("/");
            parts.pop(); // remove the filename
            
            // If it's something like "my-app/src", we want "my-app/"
            const srcOrPublicIdx = parts.findIndex(x => x === "src" || x === "public");
            if (srcOrPublicIdx > 0) {
               baseFolder = parts.slice(0, srcOrPublicIdx).join("/") + "/";
               break;
            } else if (parts.length > 0) {
               baseFolder = parts.join("/") + "/";
               break;
            }
          }
        }

        for (let [path, content] of Object.entries(data.files)) {
          // Remove the base folder prefix if it exists
          if (path.startsWith(baseFolder)) {
             path = path.slice(baseFolder.length);
          }
          
          // Flatten src/ and public/ to root for Sandpack compatibility
          if (path.startsWith("src/")) path = path.slice(4);
          if (path.startsWith("public/")) path = path.slice(7);

          // Sandpack expects root files to start with a slash
          formattedFiles[`/${path}`] = content;
          
          // Better React detection: if we see App.js, react imports, or package.json with react
          if (path === "package.json" && content.includes("react")) isReact = true;
          if (path === "App.js" || path === "App.jsx" || path === "main.js" || path === "main.jsx") isReact = true;
          if (content.includes("import React") || content.includes("from 'react'") || content.includes('from "react"')) isReact = true;
        }
        
        if (isReact) {
            // Map common alternative entry points to index.js
            if (!formattedFiles["/index.js"]) {
                const altEntry = ["/main.js", "/main.jsx", "/index.jsx"].find(p => formattedFiles[p]);
                if (altEntry) {
                    formattedFiles["/index.js"] = formattedFiles[altEntry];
                    delete formattedFiles[altEntry];
                }
            }

            // Remove dud index.js if it doesn't mount
            if (formattedFiles["/index.js"]) {
                const idxContent = formattedFiles["/index.js"];
                if (!idxContent.includes("createRoot") && !idxContent.includes("ReactDOM.render") && !idxContent.includes("hydrate")) {
                    delete formattedFiles["/index.js"];
                }
            }

            const hasMountingIndex = formattedFiles["/index.js"] !== undefined;

            // Sandpack's default index.js imports App.js, so we MUST provide App.js if we use default index.js
            if (!formattedFiles["/App.js"] && !formattedFiles["/App.jsx"] && !hasMountingIndex) {
                if (formattedFiles["/pages/index.js"] || formattedFiles["/pages/index.jsx"]) {
                    const ext = formattedFiles["/pages/index.js"] ? "js" : "jsx";
                    formattedFiles["/App.js"] = `import React from "react";\nimport Page from "./pages/index.${ext}";\nimport "./styles/globals.css";\nexport default function App() { return <Page />; }`;
                } else {
                    const comp = Object.keys(formattedFiles).find(k => k.startsWith("/components/") && (k.endsWith(".js") || k.endsWith(".jsx")));
                    if (comp) {
                        const name = comp.split("/").pop().replace(/\.jsx?$/, "");
                        formattedFiles["/App.js"] = `import React from "react";\nimport Comp from ".${comp.replace(/\.jsx?$/, "")}";\nexport default function App() { return <Comp />; }`;
                    } else {
                        formattedFiles["/App.js"] = `import React from "react";\nexport default function App() { return <h1>Generated App (No entry point found)</h1>; }`;
                    }
                }
            }
        }
        
        // If the AI generated globals.css but we are in standard React, make sure it's loaded
        if (isReact && formattedFiles["/styles/globals.css"] && !formattedFiles["/styles.css"]) {
             formattedFiles["/styles.css"] = formattedFiles["/styles/globals.css"];
        }

        // Provide a custom fallback if no index.html exists for non-React projects
        if (!isReact && !formattedFiles["/index.html"]) {
            const pyFiles = Object.keys(formattedFiles).filter(k => k.endsWith(".py"));
            if (pyFiles.length > 0) {
                formattedFiles["/index.html"] = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Backend Project</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #151515; color: #e0e0e0; padding: 2rem; margin: 0; }
    .container { max-width: 800px; margin: 0 auto; }
    h1 { color: #fff; font-weight: 500; }
    .notice { border-left: 4px solid #3b82f6; padding: 1rem; background: rgba(59, 130, 246, 0.1); margin-top: 1.5rem; border-radius: 0 8px 8px 0; }
    .file-list { background: #222; padding: 1rem; border-radius: 8px; margin-top: 1.5rem; border: 1px solid #333; }
    .file-list ul { list-style: none; padding: 0; margin: 0; }
    .file-list li { margin: 0.5rem 0; padding: 0.5rem; background: #2a2a2a; border-radius: 4px; font-family: monospace; font-size: 13px; color: #4ade80; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Backend Project Generated</h1>
    <div class="notice">
      <p style="margin-top: 0;"><strong>Note:</strong> This project consists of Python backend code. The live preview environment runs in the browser and cannot execute Python applications.</p>
      <p style="margin-bottom: 0;">Please check the <strong>Code Files</strong> tab to view the source code, or download the files to run them locally.</p>
    </div>
    <div class="file-list">
      <h2 style="font-size: 16px; margin-top: 0; color: #fff;">Generated Python Files</h2>
      <ul>
        ${pyFiles.map(f => `<li>${f}</li>`).join('')}
      </ul>
    </div>
  </div>
</body>
</html>`;
                formattedFiles["/index.js"] = `// Backend project.`;
            } else {
                formattedFiles["/index.html"] = `<!DOCTYPE html>
<html>
<head>
  <title>App Generated</title>
  <style>body { font-family: sans-serif; padding: 2rem; color: #fff; background: #151515; }</style>
</head>
<body>
  <h1>App Generated</h1>
  <p>No frontend HTML was found in the generated files.</p>
  <p>Please check the Code Files tab to view the source code.</p>
</body>
</html>`;
                formattedFiles["/index.js"] = `// No frontend JS generated`;
            }
        }

        const extractedDeps = { "react": "^18.0.0", "react-dom": "^18.0.0" };
        Object.entries(formattedFiles).forEach(([path, content]) => {
           if (path.endsWith('.js') || path.endsWith('.jsx') || path.endsWith('.ts') || path.endsWith('.tsx')) {
               const importRegex = /import\s+(?:.*?\s+from\s+)?['"]([^.][^'"]+)['"]/g;
               let match;
               while ((match = importRegex.exec(content)) !== null) {
                   const dep = match[1];
                   if (!dep.startsWith('/') && !dep.startsWith('react') && !dep.startsWith('react-dom')) {
                       const depName = dep.startsWith('@') ? dep.split('/').slice(0, 2).join('/') : dep.split('/')[0];
                       extractedDeps[depName] = "latest";
                   }
               }
           }
        });

        if (formattedFiles["/package.json"]) {
            try {
                const pkg = JSON.parse(formattedFiles["/package.json"]);
                if (pkg.dependencies) {
                    Object.assign(extractedDeps, pkg.dependencies);
                }
            } catch (e) {}
        }

        setFiles({ data: formattedFiles, isReact, dependencies: extractedDeps });
        setLoading(false);
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || "Failed to load files");
          setLoading(false);
        }
      });

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId, tasksFilesHash, reloadKey]);

  if (!run || !run.tasks || run.tasks.length === 0) return null;
  const hasFiles = run.tasks.some(t => t.code_file_paths && t.code_file_paths.length > 0);
  if (!hasFiles) return null;

  if (loading) return null;
  if (error) return <div className="text-red-500 text-xs p-4 border border-red-500 rounded mt-6">Preview Error: {error}</div>;

  // We enforce React template if any file imported React.
  const template = files.isReact ? "react" : "vanilla";

  return (
    <section
      className="bg-[#0a0a0a] p-6 rounded-xl fade-in mt-6 relative shadow-2xl overflow-hidden border border-[#222]"
      data-testid="live-preview-card"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4 relative z-10">
        <div>
          <div className="overline mb-1 flex items-center gap-1" style={{ color: "var(--state-info, #3b82f6)" }}>
            <Desktop size={10} weight="fill" />
            live preview
          </div>
          <h3 className="font-heading text-lg font-medium">App Preview</h3>
          <p className="text-[12px] text-secondary-ink mt-1 leading-relaxed">
            Sandboxed interactive view of the generated web application.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-[#121212] p-1 rounded-lg border border-[#222] shadow-inner gap-1">
             <button
                onClick={() => setViewMode("sandpack")}
                className={`text-[12px] px-3 py-1.5 rounded-md transition-all duration-300 ${viewMode === "sandpack" ? "bg-[#222] text-primary-ink shadow-sm" : "text-muted-ink hover:text-primary-ink"}`}
             >Sandpack</button>
             <button
                onClick={() => setViewMode("iframe")}
                className={`text-[12px] px-3 py-1.5 rounded-md transition-all duration-300 ${viewMode === "iframe" ? "bg-[#222] text-primary-ink shadow-sm" : "text-muted-ink hover:text-primary-ink"}`}
             >Deployed</button>
          </div>
          <button 
            onClick={() => setReloadKey(k => k + 1)}
            className="text-[12px] px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#333] hover:bg-[#2a2a2a] hover:border-[#444] text-primary-ink transition-all duration-300 shadow-sm"
          >
            Refresh Preview
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono text-blue-400 whitespace-nowrap">
            <Code size={12} weight="bold" />
            <span>{template} environment</span>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#0a0a0a] rounded-xl overflow-hidden border border-[#222] shadow-inner relative z-10">
        {viewMode === "sandpack" ? (
          <SandpackProvider key={template + reloadKey} template={template} files={files.data} theme="dark" customSetup={{ dependencies: files.dependencies || { "react": "^18.0.0", "react-dom": "^18.0.0" } }}>
            <SandpackLayout style={{ border: 0, borderRadius: '0.75rem', overflow: 'hidden' }}>
              <SandpackPreview showNavigator={true} showOpenInCodeSandbox={false} style={{ height: "600px", width: "100%" }} />
            </SandpackLayout>
          </SandpackProvider>
        ) : (
          <div style={{ height: "600px", width: "100%", backgroundColor: "white" }}>
            <iframe 
               key={reloadKey}
               src={`http://localhost:8000/api/runs/${run.id}/preview/index.html`}
               style={{ width: "100%", height: "100%", border: "none" }}
               title="Project Preview"
            />
          </div>
        )}
      </div>
    </section>
  );
}
