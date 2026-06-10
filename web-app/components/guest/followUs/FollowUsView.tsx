import GuestPageHeader from "@/components/guest/GuestPageHeader";
import FollowUsBanner from "./FollowUsBanner";
import SocialChannelRow from "./SocialChannelRow";
import type { FollowUsPageData } from "./types";

interface FollowUsViewProps {
  data: FollowUsPageData;
}

const FollowUsView = ({ data }: FollowUsViewProps) => {
  return (
    <div className="w-full bg-white pb-10">
      <GuestPageHeader
        title={data.title}
        description={data.description}
        heroImage={data.heroImage}
        backHref="/main"
        heightClass="h-[260px]"
      />

      <div className="relative z-10 -mt-6 rounded-t-3xl bg-white pt-6">
        <FollowUsBanner data={data.banner} />

        <section className="mt-6 px-4">
          <h2 className="mb-2 text-lg font-semibold text-[#111827]">{data.sectionTitle}</h2>

          <div>
            {data.channels.map((channel) => (
              <SocialChannelRow key={channel.id} channel={channel} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FollowUsView;
