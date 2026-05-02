import { useState, useEffect } from "react";
import { Desktop, Code } from "@phosphor-icons/react";
import { fetchAllRunFiles } from "../lib/api";
import { SandpackProvider, SandpackLayout, SandpackPreview } from "@codesandbox/sandpack-react";

export default function LivePreviewCard({ run }) {
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let mounted = true;
    if (!run || !run.tasks) return;
    
    const hasFiles = run.tasks.some(t => t.code_file_paths && t.code_file_paths.length > 0);
    if (!hasFiles) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchAllRunFiles(run.id)
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
          if (path === "App.js" || path === "App.jsx") isReact = true;
          if (content.includes("import React") || content.includes("from 'react'") || content.includes('from "react"')) isReact = true;
        }
        
        // If we determined it's React but we don't have a package.json, Sandpack's template 
        // will automatically provide its default package.json which works perfectly!
        
        // Furthermore, if the AI generated a dud index.js that doesn't actually mount the React app,
        // we should delete it so Sandpack's perfectly good default index.js takes over!
        if (isReact && formattedFiles["/index.js"]) {
           const idxContent = formattedFiles["/index.js"];
           if (!idxContent.includes("createRoot") && !idxContent.includes("ReactDOM.render")) {
               delete formattedFiles["/index.js"];
           }
        }
        
        // Sandpack's React template DEMANDS an /App.js. If the AI hallucinates and builds
        // /pages/index.js instead (Next.js style) or just components, we MUST stub /App.js!
        if (isReact && !formattedFiles["/App.js"] && !formattedFiles["/App.jsx"]) {
            if (formattedFiles["/pages/index.js"]) {
                formattedFiles["/App.js"] = `import React from "react";\nimport Page from "./pages/index";\nimport "./styles/globals.css";\nexport default function App() { return <Page />; }`;
            } else {
                const comp = Object.keys(formattedFiles).find(k => k.startsWith("/components/") && k.endsWith(".js"));
                if (comp) {
                    const name = comp.split("/").pop().replace(".js", "");
                    formattedFiles["/App.js"] = `import React from "react";\nimport Comp from ".${comp.replace('.js', '')}";\nexport default function App() { return <Comp />; }`;
                } else {
                    formattedFiles["/App.js"] = `import React from "react";\nexport default function App() { return <h1>Generated App (No entry point found)</h1>; }`;
                }
            }
        }
        
        // If the AI generated globals.css but we are in standard React, make sure it's loaded
        if (isReact && formattedFiles["/styles/globals.css"] && !formattedFiles["/styles.css"]) {
             formattedFiles["/styles.css"] = formattedFiles["/styles/globals.css"];
        }

        setFiles({ data: formattedFiles, isReact });
        setLoading(false);
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || "Failed to load files");
          setLoading(false);
        }
      });

    return () => { mounted = false; };
  }, [run, reloadKey]);

  if (!run || !run.tasks || run.tasks.length === 0) return null;
  const hasFiles = run.tasks.some(t => t.code_file_paths && t.code_file_paths.length > 0);
  if (!hasFiles) return null;

  if (loading) return null;
  if (error) return <div className="text-red-500 text-xs p-4 border border-red-500 rounded mt-6">Preview Error: {error}</div>;

  // We enforce React template if any file imported React.
  const template = files.isReact ? "react" : "vanilla";

  return (
    <section
      className="surface p-5 rounded-sm fade-in mt-6 relative"
      data-testid="live-preview-card"
      style={{ borderColor: "rgba(59, 130, 246, 0.3)" }}
    >
      <div className="flex items-start justify-between mb-4 gap-3">
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
          <button 
            onClick={() => setReloadKey(k => k + 1)}
            className="text-[11px] px-2 py-1 rounded bg-[#222] hover:bg-[#333] text-primary-ink transition-colors"
          >
            Refresh Preview
          </button>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-ink whitespace-nowrap">
            <Code size={10} />
            <span>{template} environment</span>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#151515] rounded-sm overflow-hidden border border-[#222]">
        <SandpackProvider key={template + reloadKey} template={template} files={files.data} theme="dark" customSetup={{ dependencies: { "react": "^18.0.0", "react-dom": "^18.0.0" } }}>
          <SandpackLayout style={{ border: 0 }}>
            <SandpackPreview showNavigator={true} showOpenInCodeSandbox={false} style={{ height: "600px", width: "100%" }} />
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </section>
  );
}
