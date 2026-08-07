import { Bell, Search, UserCircle } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-20 bg-white border-b flex items-center justify-between px-8">

      <div>

        <h2 className="text-2xl font-bold">
          Dashboard
        </h2>

        <p className="text-gray-500">
          Welcome back 👋
        </p>

      </div>

      <div className="flex items-center gap-5">

        <div className="flex items-center bg-gray-100 rounded-xl px-4">

          <Search size={18} />

          <input
            placeholder="Search..."
            className="bg-transparent outline-none px-3 py-3"
          />

        </div>

        <Bell className="cursor-pointer" />

        <UserCircle
          size={34}
          className="cursor-pointer"
        />

      </div>

    </header>
  );
}