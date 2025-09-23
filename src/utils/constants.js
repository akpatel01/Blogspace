// Default avatar image using data URI for a professional, neutral avatar placeholder
export const DEFAULT_AVATAR = `data:image/svg+xml,${encodeURIComponent(`
<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#E2E8F0"/>
  <path d="M100 100c13.807 0 25-11.193 25-25S113.807 50 100 50s-25 11.193-25 25 11.193 25 25 25zm0 12.5c-16.667 0-50 8.333-50 25v12.5h100v-12.5c0-16.667-33.333-25-50-25z" fill="#94A3B8"/>
</svg>
`)}`;

// Default cover image URL
export const DEFAULT_COVER = 'https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80';