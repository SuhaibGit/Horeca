import {
  BookOpen,
  Calendar,
  ConciergeBell,
  Gift,
  Star,
  Store,
} from "lucide-react";
import { QuickAction, QuickActionIcon } from "./types";

interface QuickActionsProps {
  actions: QuickAction[];
}

function getActionIcon(icon: QuickActionIcon) {
  const className = "h-6 w-6 text-[#0A46A6]";

  switch (icon) {
    case "book-open":
      return <BookOpen className={className} strokeWidth={1.5} />;
    case "order-online":
      return <ConciergeBell className={className} strokeWidth={1.5} />;
    case "calendar":
      return <Calendar className={className} strokeWidth={1.5} />;
    case "store":
      return <Store className={className} strokeWidth={1.5} />;
    case "gift":
      return <Gift className={className} strokeWidth={1.5} />;
    case "star":
      return <Star className={className} strokeWidth={1.5} />;
    default:
      return <Star className={className} strokeWidth={1.5} />;
  }
}

const QuickActions = ({ actions }: QuickActionsProps) => {
  return (
    <section className="relative z-10 -mt-6 rounded-t-3xl bg-white px-4 pb-6 pt-8">
      <div className="grid grid-cols-3 gap-y-6 gap-x-3">
        {actions.map((action) => {
          const content = (
            <>
              <div className="flex h-14 w-full items-center justify-center rounded-xl border border-gray-100 bg-white">
                {getActionIcon(action.icon)}
              </div>
              <span className="text-center text-[11px] font-medium leading-tight text-[#1E293B]">
                {action.label}
              </span>
            </>
          );

          if (action.href) {
            return (
              <a
                key={action.id}
                href={action.href}
                className="flex flex-col items-center gap-2"
              >
                {content}
              </a>
            );
          }

          return (
            <button key={action.id} type="button" className="flex flex-col items-center gap-2">
              {content}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default QuickActions;
