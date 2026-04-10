import { ROUTES } from "@/routes";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-white">
            <h1 className="text-6xl font-semibold text-primary mb-4">404</h1>

            <p className="text-lg text-neutral-600 max-w-md">
                The property or page you are looking for is no longer available or may have been moved.
            </p>

            <div className="flex flex-wrap gap-4 mt-8 justify-center">
                <Link
                    href={ROUTES.PUBLIC.HOME}
                    className="px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition"
                >
                    Go Home
                </Link>

                <Link
                    href={ROUTES.PUBLIC.PROPERTIES.LIST}
                    className="px-6 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-100 transition"
                >
                    Browse Properties
                </Link>
            </div>
        </div>
    );
}