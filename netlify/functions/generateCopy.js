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

  // Tone lexicon
  const tone = {
    direct: 'Straight to the point',
    persuasive: 'Make your move today',
    personal: 'From our team to you',
    warm: 'Welcoming and friendly',
    authoritative: 'Expert insights'
  }[style] || 'Direct and clear';

  const goalLine = {
    lead_gen: 'Book a viewing today',
    brand_awareness: 'Discover the DreamHomes difference',
    community: 'Join our community of happy homeowners',
    traffic: 'Tap the link in bio for full details'
  }[goal] || 'Learn more today';

  const audienceLine = {
    first_time: 'Perfect for first‑time buyers in Dubai',
    intl_investor: 'Tailored for international investors',
    luxury: 'Crafted for luxury aficionados',
    upgrader: 'Ideal for upgraders seeking more space',
    family: 'A smart choice for growing families'
  }[audience] || 'For discerning buyers';

  const defaultBullets = ['Prime location', 'Modern finishes', 'Great amenities'];
  const pts = (bullets && bullets.length ? bullets : defaultBullets).slice(0, 3);
  const bulletLines = pts.map(p => `• ${p}`).join('\n');

  // CTA variants
  const ctaText = goal === 'lead_gen'
    ? '📩 DM us to schedule a viewing or tap the link in bio.'
    : goal === 'traffic'
      ? '🔗 Full details at the link in bio.'
      : '📲 Message us for info and availability.';

  // Hashtags helpers
  const baseTags = ['DubaiRealEstate','DreamHomes','PropertyDubai','NewListing','UAEHomes','DubaiLife','HouseHunting','OpenHouse','AgencyLife'];
  const audienceTagsMap = {
    first_time: ['FirstTimeBuyer','StarterHome'],
    intl_investor: ['DubaiInvestment','GlobalInvestor'],
    luxury: ['LuxuryRealEstate','DubaiLuxury'],
    upgrader: ['UpgradeYourHome','MoreSpace'],
    family: ['FamilyHome','NearSchools']
  };
  const audienceTags = audienceTagsMap[audience] || [];

  const response = { mock: true, flags: [] };

  if (type === 'linkedin_post') {
    // LinkedIn: fewer hashtags, professional tone, explicit value prop
    const headline = (() => {
      if (audience === 'intl_investor') return 'Dubai property insight for global investors';
      if (audience === 'luxury') return 'Premium residence in Dubai — refined living';
      if (audience === 'first_time') return 'Entry into Dubai homeownership';
      if (audience === 'family') return 'Family‑friendly living in Dubai';
      return 'Upgrading your space in Dubai';
    })();

    const paragraph = `${tone}. ${audienceLine}.\n\n${pts.join(' • ')}.\n\n${goalLine}.`;
    const caption = `${headline}\n\n${paragraph}`;
    const hashtags = ['#RealEstate', '#Dubai', '#UAE', '#Property'].slice(0, 4);
    const cta = 'Learn more via the link or message us to discuss.';

    Object.assign(response, { caption, hashtags, cta });
  } else if (type === 'ig_reel') {
    // Instagram Reel: caption + voiceover script & shot list
    const hook = (() => {
      if (audience === 'luxury') return 'New in Dubai luxury ✨';
      if (audience === 'intl_investor') return 'Dubai opportunity you can’t miss 🌍';
      if (audience === 'first_time') return 'Your first home starts here 🏡';
      if (audience === 'family') return 'Room to grow for the whole family 👨‍👩‍👧‍👦';
      return 'Upgrade your lifestyle in Dubai 🌆';
    })();

    const body = `${tone}. ${audienceLine}.\n\n${bulletLines}`;
    const caption = `${hook}\n\n${body}\n\n${ctaText}`;

    const locationTags = ['Dubai', 'UAE'];
    const hashtags = [...locationTags, ...audienceTags, 'Reel', 'ShortVideo', ...baseTags]
      .slice(0, 20)
      .map(t => `#${t}`);

    // Deterministic voiceover script that adapts to selections
    const voiceTone = style === 'warm' ? 'friendly' : style === 'authoritative' ? 'expert' : style;
    const musicTone = audience === 'luxury' ? 'ambient lounge' : audience === 'intl_investor' ? 'minimal corporate' : 'uplifting pop';

    const script = {
      voiceTone,
      musicTone,
      shots: [
        { t: '0:00-0:03', v: `Welcome to Dubai — ${pts[0].toLowerCase()}.` },
        { t: '0:03-0:06', v: `${pts[1]} that stands out.` },
        { t: '0:06-0:09', v: `${pts[2]} designed for ${audience.replace('_',' ')}.` },
        { t: '0:09-0:12', v: goal === 'lead_gen' ? 'Book a viewing today.' : 'Learn more at the link.' }
      ]
    };

    Object.assign(response, { caption, hashtags, cta: ctaText, script });
  } else {
    // Instagram Post (default): IG style with more hashtags
    const hook = (() => {
      if (audience === 'luxury') return 'New in Dubai luxury ✨';
      if (audience === 'intl_investor') return 'Dubai opportunity you can’t miss 🌍';
      if (audience === 'first_time') return 'Your first home starts here 🏡';
      if (audience === 'family') return 'Room to grow for the whole family 👨‍👩‍👧‍👦';
      return 'Upgrade your lifestyle in Dubai 🌆';
    })();
    const body = `${tone}. ${audienceLine}.\n\n${bulletLines}`;
    const caption = `${hook}\n\n${body}\n\n${ctaText}`;

    const locationTags = ['Dubai', 'UAE'];
    const hashtags = [...locationTags, ...audienceTags, 'Instagram', ...baseTags]
      .slice(0, 20)
      .map(t => `#${t}`);

    Object.assign(response, { caption, hashtags, cta: ctaText });
  }

  // Compliance flags
  const textToScan = `${response.caption} ${(response.hashtags||[]).join(' ')}`;
  for (const re of BAD_PHRASES) {
    if (re.test(textToScan)) response.flags.push('Potential prohibited claim detected');
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(response)
  };
};
