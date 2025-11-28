-- Critical Performance Indexes
-- These indexes are essential for handling 1000+ concurrent users

-- Fields table indexes (critical for dashboard queries)
CREATE INDEX IF NOT EXISTS idx_fields_user_id ON fields(user_id);
CREATE INDEX IF NOT EXISTS idx_fields_status ON fields(status);
CREATE INDEX IF NOT EXISTS idx_fields_created_at ON fields(created_at DESC);

-- Field data indexes (critical for satellite data queries)
CREATE INDEX IF NOT EXISTS idx_field_data_field_id ON field_data(field_id);
CREATE INDEX IF NOT EXISTS idx_field_data_timestamp ON field_data(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_field_data_field_timestamp ON field_data(field_id, timestamp DESC);

-- Analytics events indexes (for batched inserts)
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);

-- Disease detection indexes
CREATE INDEX IF NOT EXISTS idx_disease_detection_user_id ON disease_detections(user_id);
CREATE INDEX IF NOT EXISTS idx_disease_detection_field_id ON disease_detections(field_id);
CREATE INDEX IF NOT EXISTS idx_disease_detection_created_at ON disease_detections(created_at DESC);

-- Cart and orders indexes
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
