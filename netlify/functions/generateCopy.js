// Mocked AI copy generation — returns deterministic dummy data only.
// POST /.netlify/functions/generateCopy
// Body: { goal, audience, type, style, bullets? }

const BAD_PHRASES = [/guaranteed/i, /risk[- ]?free/i, /insider/i, /(\d+\s*%\s*)(roi|return)/i];

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let input = {};
  try {
    input = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { goal = 'lead_gen', audience = 'first_time', type = 'ig_post', style = 'direct', bullets = [] } = input;

  // Simple deterministic templates
  const styleTone = {
    direct: 'Straight to the point',
    persuasive: 'Make your move today',
    personal: 'From our team to you',
    warm: 'Welcoming and friendly',
    authoritative: 'Expert insights'
  }[style] || 'Direct and clear';

  const goalLine = {
    lead_gen: 'Book a viewing now',
    brand_awareness: 'Discover the DreamHomes difference',
    community: 'Join our community of happy homeowners',
    traffic: 'Explore more details on our website'
  }[goal] || 'Learn more today';

  const audienceLine = {
    first_time: 'Perfect for first-time buyers in Dubai',
    intl_investor: 'Tailored for international investors',
    luxury: 'For luxury aficionados seeking excellence',
    upgrader: 'Ideal for upgraders looking for more space',
    family: 'A smart choice for growing families'
  }[audience] || 'For discerning buyers';

  const typePrefix = type === 'linkedin_post' ? 'LinkedIn' : type === 'ig_reel' ? 'Reel' : 'Instagram';

  const points = bullets.length ? `Highlights: ${bullets.slice(0, 3).join(' • ')}.` : 'Highlights: prime location • modern finishes • great amenities.';

  const caption = `${styleTone}. ${audienceLine}. ${points} ${goalLine}.`;

  const hashtags = [
    '#DubaiRealEstate',
    '#DreamHomes',
    '#PropertyDubai',
    '#NewListing',
    '#UAEHomes',
    '#HouseHunting',
    '#Investment',
    '#AgencyLife',
    '#OpenHouse',
    `#${typePrefix}`
  ];

  const cta = 'Send us a DM or click the link in bio to schedule a viewing.';

  // Simple compliance flags
  const flags = [];
  const textToScan = `${caption} ${hashtags.join(' ')} ${cta}`;
  for (const re of BAD_PHRASES) {
    if (re.test(textToScan)) flags.push('Potential prohibited claim detected');
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ caption, hashtags, cta, flags, mock: true })
  };
};
