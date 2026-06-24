import VenueRepository, { VenueUpdateData } from "./VenueRepository";

type VenuePayload = {
  venue_id: number;
  name: string;
  category: string;
  brand_color: string;
  logo_url: string | null;
};

function toVenuePayload(venue: {
  venue_id: number;
  name: string;
  category: string;
  brand_color: string;
  logo_url: string | null;
}): VenuePayload {
  return {
    venue_id: venue.venue_id,
    name: venue.name,
    category: venue.category,
    brand_color: venue.brand_color,
    logo_url: venue.logo_url,
  };
}

class VenueService {
  private venueRepo = new VenueRepository();

  async getMyVenue(userId: number) {
    const venue = await this.venueRepo.findByOwnerId(userId);
    if (!venue) {
      return { success: false as const, message: "Venue not found" };
    }
    return { success: true as const, venue: toVenuePayload(venue) };
  }

  async createVenue(
    userId: number,
    body: {
      name: string;
      category: string;
      brand_color?: string;
      logo_url?: string;
    }
  ) {
    const existing = await this.venueRepo.findByOwnerId(userId);
    if (existing) {
      return { success: false as const, message: "Venue already exists" };
    }

    const venue = await this.venueRepo.create({
      owner_user_id: userId,
      name: body.name,
      category: body.category,
      brand_color: body.brand_color,
      logo_url: body.logo_url ?? null,
    });

    return { success: true as const, venue: toVenuePayload(venue) };
  }

  async updateMyVenue(userId: number, data: VenueUpdateData) {
    const venue = await this.venueRepo.findByOwnerId(userId);
    if (!venue) {
      return { success: false as const, message: "Venue not found" };
    }

    const updated = await this.venueRepo.update(venue.venue_id, data);
    return { success: true as const, venue: toVenuePayload(updated) };
  }
}

export default VenueService;
