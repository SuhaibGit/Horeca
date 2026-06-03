export type ReviewPlatformId = "google" | "tripadvisor" | "yelp" | "facebook";
export type ReviewStatus = "Pending" | "Replied";

export interface Review {
  id: string;
  customerName: string;
  customerAvatar?: string;
  customerSince?: string;
  platform: ReviewPlatformId;
  rating: number;
  preview: string;
  fullReview: string;
  date: string;
  time: string;
  status: ReviewStatus;
  images?: string[];
  response?: {
    text: string;
    date: string;
    time: string;
  };
}

export const MOCK_REVIEWS_STATS = {
  overallRating: "4.6",
  totalReviews: "1,248",
  totalReviewsGrowth: "+15.4%",
  newReviews: "32",
  newReviewsGrowth: "+15.4%",
  repliedReviews: "28",
  repliedReviewsGrowth: "+15.4%",
  averageResponseTime: "6h 24m",
  averageResponseTimeGrowth: "+4.12%",
};

export const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    customerName: "Naomi Clark",
    customerSince: "Jan 2024",
    platform: "google",
    rating: 5,
    preview: "Amazin Food offers a delig...",
    fullReview: "Amazin Food offers a delightful dining experience with fresh flavors and friendly service. The cozy atmosphere makes it a great spot to enjoy a meal after a day of exploring nearby hotels.",
    date: "12/12/2026",
    time: "2:30 PM",
    status: "Pending",
    images: ["/assets/food1.jpg", "/assets/food2.jpg", "/assets/food3.jpg", "/assets/food4.jpg"],
  },
  {
    id: "r2",
    customerName: "Naomi Clark",
    customerSince: "Jan 2024",
    platform: "tripadvisor",
    rating: 5,
    preview: "Amazin Food offers a delig...",
    fullReview: "Amazin Food offers a delightful dining experience with fresh flavors and friendly service. The cozy atmosphere makes it a great spot to enjoy a meal after a day of exploring nearby hotels.",
    date: "12/12/2026",
    time: "2:30 PM",
    status: "Replied",
    response: {
      text: "Thank you Naomi! We are so glad you enjoyed your dining experience with us.",
      date: "May 18, 2024",
      time: "06:05 PM"
    }
  },
  {
    id: "r3",
    customerName: "Naomi Clark",
    platform: "yelp",
    rating: 5,
    preview: "Amazin Food offers a delig...",
    fullReview: "Amazin Food offers a delightful dining experience with fresh flavors and friendly service.",
    date: "12/12/2026",
    time: "2:30 PM",
    status: "Pending",
  },
  {
    id: "r4",
    customerName: "Naomi Clark",
    platform: "facebook",
    rating: 5,
    preview: "Amazin Food offers a delig...",
    fullReview: "Amazin Food offers a delightful dining experience with fresh flavors and friendly service.",
    date: "12/12/2026",
    time: "2:30 PM",
    status: "Replied",
    response: {
      text: "Thanks for the feedback!",
      date: "12/12/2026",
      time: "3:00 PM"
    }
  },
  {
    id: "r5",
    customerName: "Sophia Martinez",
    platform: "facebook",
    rating: 4,
    preview: "The Green Leaf Cafe delive...",
    fullReview: "The Green Leaf Cafe delivers on its promise of fresh, organic meals.",
    date: "02/28/2027",
    time: "1:15 PM",
    status: "Pending",
  },
  {
    id: "r6",
    customerName: "Liam Johnson",
    platform: "yelp",
    rating: 3,
    preview: "Tech Haven provides cuttin...",
    fullReview: "Tech Haven provides cutting edge products but customer service could be improved.",
    date: "01/15/2027",
    time: "10:00 AM",
    status: "Pending",
  },
  {
    id: "r7",
    customerName: "Noah Wilson",
    platform: "google",
    rating: 5,
    preview: "Electric Avenue showcases...",
    fullReview: "Electric Avenue showcases the best electric vehicles in town. A must visit!",
    date: "05/30/2027",
    time: "11:45 AM",
    status: "Pending",
  }
];

export const updateReviewResponse = (id: string, responseText: string) => {
  const index = MOCK_REVIEWS.findIndex(r => r.id === id);
  if (index !== -1) {
    MOCK_REVIEWS[index].status = "Replied";
    MOCK_REVIEWS[index].response = {
      text: responseText,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    };
  }
};
