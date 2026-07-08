export const metadata = {
  title: 'Settings',
};

export default async function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-500 mt-1">Admin portal configuration will be available in a future update.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-base font-semibold text-slate-800 mb-4">General</h3>
        <div className="space-y-4 text-sm text-slate-500">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span>Admin Role</span>
            <span className="font-medium text-slate-700">Enabled</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span>Audit Logging</span>
            <span className="font-medium text-slate-700">Enabled</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span>Product Management</span>
            <span className="font-medium text-slate-700">Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
}
