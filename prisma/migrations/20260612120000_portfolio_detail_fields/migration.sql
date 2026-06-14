-- Portfolio detail page fields
ALTER TABLE "PortfolioProject" ADD COLUMN IF NOT EXISTS "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[];

ALTER TABLE "PortfolioTranslation" ADD COLUMN IF NOT EXISTS "overview" TEXT;
ALTER TABLE "PortfolioTranslation" ADD COLUMN IF NOT EXISTS "challenge" TEXT;
ALTER TABLE "PortfolioTranslation" ADD COLUMN IF NOT EXISTS "solution" TEXT;
ALTER TABLE "PortfolioTranslation" ADD COLUMN IF NOT EXISTS "features" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "PortfolioTranslation" ADD COLUMN IF NOT EXISTS "results" TEXT;
ALTER TABLE "PortfolioTranslation" ADD COLUMN IF NOT EXISTS "outcome" TEXT;
