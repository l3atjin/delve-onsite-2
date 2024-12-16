import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Check, XCircle } from "lucide-react";
import EnableAllRLSButton from "@/components/EnableAllRLSButton";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch checks
  const [usersMFA, tables, projects, buckets] = await Promise.all([
    fetchCheckData("mfa"),
    fetchCheckData("rls"),
    fetchCheckData("pitr"),
    fetchCheckData("storage"),
  ]);

  return (
    <div className="flex-1 w-full flex flex-col gap-12 p-6">
      {/* users */}
      <section>
        <h2 className="font-bold text-2xl mb-4 flex items-center gap-2">
          Users MFA Status
        </h2>
        <div className="overflow-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="border-b font-medium">
              <tr>
                <th className="p-2">User ID</th>
                <th className="p-2">MFA Enabled</th>
              </tr>
            </thead>
            <tbody>
              {usersMFA.map((user: any) => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="p-2">{user.id}</td>
                  <td className="p-2">
                    {user.mfaEnabled ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <Check size={16} />
                        Pass
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center gap-1">
                        <XCircle size={16} />
                        Fail
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* tables */}
      <section>
        <h2 className="font-bold text-2xl mb-4 flex items-center gap-2">
          Tables RLS Status
        </h2>
        <div className="overflow-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="border-b font-medium">
              <tr>
                <th className="p-2">Table Name</th>
                <th className="p-2">RLS Enabled</th>
              </tr>
            </thead>
            <tbody>
              {tables.map((table: any, idx: number) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="p-2">{table.name}</td>
                  <td className="p-2">
                    {table.rlsEnabled ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <Check size={16} />
                        Pass
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center gap-1">
                        <XCircle size={16} />
                        Fail
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <EnableAllRLSButton />
        </div>
      </section>

      {/* pitr */}
      <section>
        <h2 className="font-bold text-2xl mb-4 flex items-center gap-2">
          Projects PITR Status
        </h2>
        <div className="overflow-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="border-b font-medium">
              <tr>
                <th className="p-2">Project Name</th>
                <th className="p-2">PITR Enabled</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project: any, idx: number) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="p-2">{project.name}</td>
                  <td className="p-2">
                    {project.pitrEnabled ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <Check size={16} />
                        Pass
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center gap-1">
                        <XCircle size={16} />
                        Fail
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* storage */}
      <section>
        <h2 className="font-bold text-2xl mb-4 flex items-center gap-2">
          Storage Visibility Status
        </h2>
        <div className="overflow-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="border-b font-medium">
              <tr>
                <th className="p-2">Bucket Name</th>
                <th className="p-2">Visbility</th>
              </tr>
            </thead>
            <tbody>
              {buckets.map((bucket: any, idx: number) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="p-2">{bucket.name}</td>
                  <td className="p-2">
                    {bucket.private ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <Check size={16} />
                        Pass
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center gap-1">
                        <XCircle size={16} />
                        Fail
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

async function fetchCheckData(type: "mfa" | "rls" | "pitr" | "storage") {
  let endpoint = "";
  if (type === "mfa") endpoint = "/api/check-mfa";
  else if (type === "rls") endpoint = "/api/check-rls";
  else if (type === "pitr") endpoint = "/api/check-pitr";
  else if (type === "storage") endpoint = "/api/check-storage";

  const response = await fetch(`http://localhost:3000${endpoint}`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Unknown error");
  }

  return data.results;
}
