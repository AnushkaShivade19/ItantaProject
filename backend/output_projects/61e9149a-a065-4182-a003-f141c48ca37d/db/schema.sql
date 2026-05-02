CREATE TABLE menu_items (
    id uuid PRIMARY KEY,
    name string NOT NULL,
    price float NOT NULL
);

CREATE INDEX idx_menu_items_name ON menu_items (name);

CREATE TABLE reviews (
    id uuid PRIMARY KEY,
    text string NOT NULL,
    rating int NOT NULL
);

CREATE INDEX idx_reviews_text ON reviews (text);

CREATE TABLE orders (
    id uuid PRIMARY KEY,
    status string NOT NULL
);

CREATE INDEX idx_orders_status ON orders (status);