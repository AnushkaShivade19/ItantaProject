import { useState } from "react";
import {
  TreeStructure,
  Folder,
  FileText as FileIcon,
  Plug,
  Database,
  Cube,
  CaretDown,
  CaretRight,
} from "@phosphor-icons/react";

const METHOD_COLOR = {
  GET: "var(--state-success)",
  POST: "var(--state-running)",
  PUT: "var(--state-warning)",
  PATCH: "var(--state-warning)",
  DELETE: "var(--state-error)",
};

const flattenTree = (node, depth = 0, parentKey = "", out = []) => {
  if (!node) return out;
  const key = `${parentKey}/${node.name}`;
  const isDir =
    node.type === "dir" && Array.isArray(node.children) && node.children.length > 0;
  out.push({ name: node.name, purpose: node.purpose, depth, isDir, key });
  if (isDir) {
    for (const child of node.children) {
      flattenTree(child, depth + 1, key, out);
    }
  }
  return out;
};

function TreeRow({ row }) {
  const Icon = row.isDir ? Folder : FileIcon;
  const color = row.isDir ? "var(--state-running)" : "var(--text-secondary)";
  return (
    <div
      className="flex items-center gap-1 py-0.5 rounded-sm px-1"
      style={{ paddingLeft: `${row.depth * 14 + 4}px` }}
      data-testid={`tree-row-${row.key}`}
    >
      <Icon size={12} color={color} />
      <span className="text-[12px] font-mono text-primary-ink">{row.name}</span>
      {row.purpose && (
        <span className="text-[11px] text-muted-ink ml-2 truncate">
          {row.purpose}
        </span>
      )}
    </div>
  );
}

function FolderTree({ root }) {
  const [open, setOpen] = useState(true);
  const rows = open ? flattenTree(root) : [{ name: root.name, depth: 0, isDir: true, key: root.name }];
  const Caret = open ? CaretDown : CaretRight;
  return (
    <div className="font-mono">
      <div
        className="flex items-center gap-1 cursor-pointer"
        onClick={() => setOpen((v) => !v)}
        data-testid="folder-tree-toggle"
      >
        <Caret size={10} color="var(--text-muted)" />
        <span className="text-[10px] font-mono text-muted-ink uppercase tracking-wider">
          {open ? "collapse" : "expand"}
        </span>
      </div>
      <div className="mt-1">
        {rows.map((r) => (
          <TreeRow key={r.key} row={r} />
        ))}
      </div>
    </div>
  );
}

function ApiRow({ api }) {
  const color = METHOD_COLOR[api.method] || "var(--text-secondary)";
  return (
    <div
      className="flex items-start gap-2 py-1 border-b last:border-0"
      style={{ borderColor: "var(--border)" }}
      data-testid={`api-row-${api.method}-${api.path}`}
    >
      <span
        className="text-[10px] font-mono font-bold w-12 shrink-0 mt-0.5"
        style={{ color }}
      >
        {api.method}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-mono text-primary-ink truncate">
          {api.path}
        </div>
        {api.purpose && (
          <div className="text-[11px] text-secondary-ink leading-snug">
            {api.purpose}
          </div>
        )}
      </div>
    </div>
  );
}

function FieldRow({ field }) {
  return (
    <div className="flex items-baseline gap-2 text-[11px] font-mono">
      <span className="text-primary-ink shrink-0">{field.name}</span>
      <span style={{ color: "var(--state-running)" }}>{field.type}</span>
      {field.constraints?.length > 0 && (
        <span className="text-muted-ink truncate">
          {field.constraints.join(" / ")}
        </span>
      )}
    </div>
  );
}

function TableCard({ table }) {
  return (
    <div
      className="p-3 rounded-sm"
      style={{ background: "var(--surface-elevated)", border: "1px solid var(--border)" }}
      data-testid={`table-${table.name}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-heading text-[13px] font-medium">{table.name}</span>
        {table.indexes?.length > 0 && (
          <span className="text-[10px] font-mono text-muted-ink">
            idx {table.indexes.join(", ")}
          </span>
        )}
      </div>
      <div className="space-y-0.5">
        {(table.fields || []).map((f) => (
          <FieldRow key={`${table.name}-${f.name}`} field={f} />
        ))}
      </div>
    </div>
  );
}

function ModuleChip({ mod }) {
  return (
    <div
      className="flex items-baseline gap-2 px-2 py-1 rounded-sm"
      style={{ background: "var(--surface-elevated)", border: "1px solid var(--border)" }}
      data-testid={`module-${mod.name}`}
    >
      <span className="text-[12px] font-mono text-primary-ink">{mod.name}</span>
      <span className="text-[11px] text-secondary-ink truncate">
        {mod.responsibility}
      </span>
    </div>
  );
}

function CardSection({ Icon, label, count, children }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <Icon size={12} weight="fill" color="var(--text-secondary)" />
        <span className="overline">{label}</span>
        {typeof count === "number" && (
          <span className="text-[10px] font-mono text-muted-ink ml-auto">
            {count}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

export default function ArchitectureCard({ run }) {
  const arch = run?.architecture;
  if (!arch || !arch.folder_structure) return null;

  return (
    <section
      className="surface p-5 rounded-sm fade-in"
      data-testid="architecture-card"
      style={{ borderColor: "rgba(16, 185, 129, 0.3)" }}
    >
      <div className="flex items-start justify-between mb-3 gap-3">
        <div>
          <div className="overline mb-1 flex items-center gap-1">
            <TreeStructure size={10} weight="fill" color="var(--state-success)" />
            architecture ready
          </div>
          <h3 className="font-heading text-lg font-medium">System Design</h3>
        </div>
        <span className="text-[10px] font-mono text-muted-ink">architect v1</span>
      </div>

      <div className="space-y-5 mt-4">
        <CardSection Icon={Folder} label="folder structure">
          <FolderTree root={arch.folder_structure} />
        </CardSection>

        <CardSection Icon={Plug} label="api endpoints" count={arch.apis?.length}>
          <div>
            {(arch.apis || []).map((api) => (
              <ApiRow key={`${api.method}-${api.path}`} api={api} />
            ))}
          </div>
        </CardSection>

        <CardSection Icon={Database} label="db schema" count={arch.db_schema?.length}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {(arch.db_schema || []).map((t) => (
              <TableCard key={t.name} table={t} />
            ))}
          </div>
        </CardSection>

        <CardSection Icon={Cube} label="modules" count={arch.modules?.length}>
          <div className="flex flex-wrap gap-1.5">
            {(arch.modules || []).map((m) => (
              <ModuleChip key={m.name} mod={m} />
            ))}
          </div>
        </CardSection>
      </div>
    </section>
  );
}
