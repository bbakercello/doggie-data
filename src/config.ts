const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const config = {
  endpoints: {
    discoverPet: `${API_BASE_URL}/discoverPet`,
    // Add more endpoints here
  }
};

export default config