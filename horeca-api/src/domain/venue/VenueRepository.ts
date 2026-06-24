import { Prisma } from "@prisma/client";
import { prisma } from "../../config/dbConnection";

export type VenueUpdateData = {
  name?: string;
  category?: string;
  brand_color?: string;
  logo_url?: string | null;
};

class VenueRepository {
  async findByOwnerId(userId: number) {
    return prisma.venue.findFirst({
      where: { owner_user_id: userId },
    });
  }

  async create(venue: {
    owner_user_id: number;
    name: string;
    category: string;
    brand_color?: string;
    logo_url?: string | null;
  }) {
    return prisma.venue.create({
      data: {
        owner_user_id: venue.owner_user_id,
        name: venue.name.trim(),
        category: venue.category.trim(),
        brand_color: venue.brand_color,
        logo_url: venue.logo_url ?? null,
      },
    });
  }

  async update(venueId: number, data: VenueUpdateData) {
    const patch: Prisma.VenueUpdateInput = {};

    if (data.name !== undefined) {
      patch.name = data.name.trim();
    }
    if (data.category !== undefined) {
      patch.category = data.category.trim();
    }
    if (data.brand_color !== undefined) {
      patch.brand_color = data.brand_color;
    }
    if (data.logo_url !== undefined) {
      patch.logo_url = data.logo_url;
    }

    return prisma.venue.update({
      where: { venue_id: venueId },
      data: patch,
    });
  }
}

export default VenueRepository;
