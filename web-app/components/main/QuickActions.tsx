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

const ICON_GRADIENT_ID = "quick-action-icon-gradient";

function getActionIcon(icon: QuickActionIcon) {
  const iconProps = {
    className: "h-10 w-10",
    strokeWidth: 1.5,
    stroke: `url(#${ICON_GRADIENT_ID})`,
  };

  switch (icon) {
    case "book-open":
      return <BookOpen {...iconProps} />;
    case "order-online":
      return <ConciergeBell {...iconProps} />;
    case "calendar":
      return <Calendar {...iconProps} />;
    case "store":
      return <Store {...iconProps} />;
    case "gift":
      return <Gift {...iconProps} />;
    case "star":
      return <Star {...iconProps} />;
    default:
      return <Star {...iconProps} />;
  }
}

const QuickActions = ({ actions }: QuickActionsProps) => {
  return (
    <>
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <defs>
          <linearGradient id={ICON_GRADIENT_ID} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#041B40" />
            <stop offset="100%" stopColor="#0A46A6" />
          </linearGradient>
        </defs>
      </svg>

      <section className="relative z-10 -mt-6 rounded-t-3xl bg-white px-4 pb-6 pt-8">
      <div className="grid grid-cols-3 gap-y-6 gap-x-3">
        {actions.map((action) => {
          const content = (
            <>
              <div className="flex flex-col items-center gap-2 h-[85px] w-full items-center justify-center shadow-sm rounded-xl border border-gray-100 bg-white">
                {getActionIcon(action.icon)}
                <span className="text-center text-[12px] font-medium leading-tight text-[#1E293B]">
                  {action.label}
                </span>
              </div>

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
    </>
  );
};

export default QuickActions;
