-- Reference data: trades. Kept in sync with TRADES in src/lib/constants.ts (the seed script upserts the same rows).
INSERT INTO "Trade" ("id", "slug", "nameEn", "nameEt") VALUES
  ('trade_general-construction', 'general-construction', 'General construction', 'Üldehitus'),
  ('trade_concrete', 'concrete', 'Concrete work', 'Betoonitööd'),
  ('trade_masonry', 'masonry', 'Masonry', 'Müüritööd'),
  ('trade_carpentry', 'carpentry', 'Carpentry', 'Puusepatööd'),
  ('trade_roofing', 'roofing', 'Roofing', 'Katusetööd'),
  ('trade_facade', 'facade', 'Facade work', 'Fassaaditööd'),
  ('trade_electrical', 'electrical', 'Electrical', 'Elektritööd'),
  ('trade_plumbing', 'plumbing', 'Plumbing', 'Torutööd'),
  ('trade_hvac', 'hvac', 'HVAC / ventilation', 'Küte ja ventilatsioon'),
  ('trade_drywall', 'drywall', 'Drywall', 'Kipsplaaditööd'),
  ('trade_painting', 'painting', 'Painting & finishing', 'Maalri- ja viimistlustööd'),
  ('trade_tiling', 'tiling', 'Tiling', 'Plaatimistööd'),
  ('trade_flooring', 'flooring', 'Flooring', 'Põrandatööd'),
  ('trade_insulation', 'insulation', 'Insulation', 'Soojustustööd'),
  ('trade_welding', 'welding', 'Welding & steelwork', 'Keevitus- ja metallitööd'),
  ('trade_earthworks', 'earthworks', 'Earthworks', 'Pinnasetööd'),
  ('trade_demolition', 'demolition', 'Demolition', 'Lammutustööd'),
  ('trade_landscaping', 'landscaping', 'Landscaping', 'Haljastustööd'),
  ('trade_windows-doors', 'windows-doors', 'Windows & doors', 'Akende ja uste paigaldus'),
  ('trade_scaffolding', 'scaffolding', 'Scaffolding', 'Tellingutööd')
ON CONFLICT ("slug") DO NOTHING;
