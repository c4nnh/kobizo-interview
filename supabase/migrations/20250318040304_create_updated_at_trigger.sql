-- Ensure `updatedAt` is automatically updated on row updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON "Tasks"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
