import CreatorCard from "../models/CreatorCard.js";



// Auto-generate a slug from a title

export const generateSlugFromTitle = (title) => {
  let slug = title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '');
  
  // Ensure minimum length
  if (slug.length < 5) {
    slug = slug.padEnd(5, '0');
  }
  
  return slug;
};

// Generate a random alphanumeric suffix

export const generateRandomSuffix = (length = 6) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Check if a slug is already taken

export const isSlugTaken = async (slug) => {
  const existingCard = await CreatorCard.findOne({ 
    slug, 
    deleted: null 
  });
  return !!existingCard;
};

// Generate a unique slug from a title

export const generateUniqueSlug = async (title) => {
  const baseSlug = generateSlugFromTitle(title);
  
  // If no card with this slug exists, return it
  if (!await isSlugTaken(baseSlug)) {
    return baseSlug;
  }
  
  // If base slug is taken, append a random suffix
  const suffix = generateRandomSuffix(6);
  const newSlug = `${baseSlug}-${suffix}`;
  
  // Check again (recursive to ensure uniqueness)
  if (!await isSlugTaken(newSlug)) {
    return newSlug;
  }
  
  // If somehow still taken, generate a completely random slug
  let randomSlug;
  let attempts = 0;
  do {
    randomSlug = `card-${generateRandomSuffix(10)}`;
    attempts++;
  } while (await isSlugTaken(randomSlug) && attempts < 10);
  
  return randomSlug;
};
