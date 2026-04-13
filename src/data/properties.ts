import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  type: "House" | "Apartment" | "Villa" | "Townhouse" | "Condo" | "Cottage";
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  features: string[];
  image: string;
  featured: boolean;
}

export const properties: Property[] = [
  {
    id: "1",
    title: "Modern Luxury Apartment",
    price: 450000,
    location: "Downtown",
    type: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    description: "A stunning modern apartment in the heart of downtown with panoramic city views. Features floor-to-ceiling windows, premium finishes, and an open-concept living space perfect for entertaining. The building offers a rooftop terrace, gym, and 24/7 concierge service.",
    features: ["City View", "Gym", "Parking", "Concierge", "Rooftop Terrace", "Smart Home"],
    image: property1,
    featured: true,
  },
  {
    id: "2",
    title: "Charming Family Home",
    price: 620000,
    location: "Suburbia",
    type: "House",
    bedrooms: 4,
    bathrooms: 3,
    area: 2400,
    description: "A beautiful family home set in a quiet suburban neighborhood. This property features a spacious backyard, updated kitchen with granite countertops, hardwood floors throughout, and a cozy fireplace in the living room. Close to top-rated schools and parks.",
    features: ["Garden", "Garage", "Fireplace", "Hardwood Floors", "Updated Kitchen", "Near Schools"],
    image: property2,
    featured: true,
  },
  {
    id: "3",
    title: "Skyline Penthouse",
    price: 1250000,
    location: "City Center",
    type: "Condo",
    bedrooms: 3,
    bathrooms: 3,
    area: 3200,
    description: "An exceptional penthouse offering breathtaking 360-degree city views. This premium residence features a private elevator, designer kitchen, spa-like bathrooms, and an expansive wraparound terrace. The epitome of luxury urban living.",
    features: ["Panoramic Views", "Private Elevator", "Terrace", "Designer Kitchen", "Spa Bathroom", "Wine Cellar"],
    image: property3,
    featured: true,
  },
  {
    id: "4",
    title: "Historic Brick Townhouse",
    price: 780000,
    location: "Old Town",
    type: "Townhouse",
    bedrooms: 3,
    bathrooms: 2,
    area: 2100,
    description: "A beautifully restored townhouse on a tree-lined street in the historic district. Original brick facade with modern interior updates including a chef's kitchen, exposed brick walls, and private garden. Walk to restaurants, shops, and cultural venues.",
    features: ["Historic Character", "Private Garden", "Exposed Brick", "Chef's Kitchen", "Walkable Location", "Basement"],
    image: property4,
    featured: false,
  },
  {
    id: "5",
    title: "Mediterranean Villa with Pool",
    price: 980000,
    location: "Coastal Heights",
    type: "Villa",
    bedrooms: 5,
    bathrooms: 4,
    area: 4500,
    description: "A magnificent Mediterranean-style villa with a resort-like swimming pool. This expansive property boasts sun-drenched living spaces, a gourmet kitchen, multiple terraces, and lush landscaping. Perfect for those seeking a luxurious coastal lifestyle.",
    features: ["Swimming Pool", "Ocean Nearby", "Multiple Terraces", "Gourmet Kitchen", "Landscaped Gardens", "Home Office"],
    image: property5,
    featured: true,
  },
  {
    id: "6",
    title: "Stone Cottage Retreat",
    price: 340000,
    location: "Countryside",
    type: "Cottage",
    bedrooms: 2,
    bathrooms: 1,
    area: 1200,
    description: "An enchanting stone cottage nestled in the peaceful countryside. Features original stone walls, a charming garden with flowering plants, cozy interiors with wood-burning stove, and serene views of rolling hills. An idyllic escape from city life.",
    features: ["Stone Walls", "Garden", "Wood Stove", "Country Views", "Quiet Location", "Character"],
    image: property6,
    featured: false,
  },
];
