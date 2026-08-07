export default function Dashboard() {
  return (
    <div>

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          AI Meeting Intelligence Overview
        </p>

      </div>

      <div className="grid grid-cols-4 gap-6">

        <div className="bg-white rounded-2xl p-6 shadow-sm">

          <h3 className="text-gray-500 text-sm">
            Total Meetings
          </h3>

          <h2 className="text-4xl font-bold mt-3">
            0
          </h2>

        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">

          <h3 className="text-gray-500 text-sm">
            Uploaded Audio
          </h3>

          <h2 className="text-4xl font-bold mt-3">
            0
          </h2>

        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">

          <h3 className="text-gray-500 text-sm">
            AI Summaries
          </h3>

          <h2 className="text-4xl font-bold mt-3">
            0
          </h2>

        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">

          <h3 className="text-gray-500 text-sm">
            Reports
          </h3>

          <h2 className="text-4xl font-bold mt-3">
            0
          </h2>

        </div>

      </div>

      <div className="grid grid-cols-2 gap-6 mt-8">

        <div className="bg-white rounded-2xl h-[350px] shadow-sm p-6">

          <h2 className="text-xl font-semibold mb-4">
            Recent Meetings
          </h2>

          <div className="flex items-center justify-center h-full text-gray-400">

            No meetings found

          </div>

        </div>

        <div className="bg-white rounded-2xl h-[350px] shadow-sm p-6">

          <h2 className="text-xl font-semibold mb-4">
            AI Activity
          </h2>

          <div className="flex items-center justify-center h-full text-gray-400">

            No activity

          </div>

        </div>

      </div>

    </div>
  );
}