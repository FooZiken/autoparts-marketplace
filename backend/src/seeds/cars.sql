-- =========================
-- CLEAN
-- =========================

DELETE FROM bodies;
DELETE FROM car_models;
DELETE FROM brands;

-- =========================
-- BRANDS
-- =========================

INSERT INTO brands (id, name) VALUES
(uuid_generate_v4(), 'BMW'),
(uuid_generate_v4(), 'Audi');

-- =========================
-- MODELS
-- =========================

-- BMW
INSERT INTO car_models (id, name, "brandId")
SELECT uuid_generate_v4(), '3 Series', id
FROM brands WHERE name = 'BMW';

INSERT INTO car_models (id, name, "brandId")
SELECT uuid_generate_v4(), '5 Series', id
FROM brands WHERE name = 'BMW';

-- Audi
INSERT INTO car_models (id, name, "brandId")
SELECT uuid_generate_v4(), 'A4', id
FROM brands WHERE name = 'Audi';

INSERT INTO car_models (id, name, "brandId")
SELECT uuid_generate_v4(), 'A6', id
FROM brands WHERE name = 'Audi';

-- =========================
-- BODIES
-- =========================

-- BMW 3 Series
INSERT INTO bodies (id, name, "carModelId", "productionStart", "productionEnd")
SELECT uuid_generate_v4(), 'E90', id, 2005, 2012
FROM car_models WHERE name = '3 Series';

INSERT INTO bodies (id, name, "carModelId", "productionStart", "productionEnd")
SELECT uuid_generate_v4(), 'F30', id, 2011, 2019
FROM car_models WHERE name = '3 Series';

-- BMW 5 Series
INSERT INTO bodies (id, name, "carModelId", "productionStart", "productionEnd")
SELECT uuid_generate_v4(), 'E60', id, 2003, 2010
FROM car_models WHERE name = '5 Series';

INSERT INTO bodies (id, name, "carModelId", "productionStart", "productionEnd")
SELECT uuid_generate_v4(), 'F10', id, 2010, 2017
FROM car_models WHERE name = '5 Series';

-- Audi A4
INSERT INTO bodies (id, name, "carModelId", "productionStart", "productionEnd")
SELECT uuid_generate_v4(), 'B7', id, 2004, 2008
FROM car_models WHERE name = 'A4';

INSERT INTO bodies (id, name, "carModelId", "productionStart", "productionEnd")
SELECT uuid_generate_v4(), 'B8', id, 2008, 2015
FROM car_models WHERE name = 'A4';

-- Audi A6
INSERT INTO bodies (id, name, "carModelId", "productionStart", "productionEnd")
SELECT uuid_generate_v4(), 'C6', id, 2004, 2011
FROM car_models WHERE name = 'A6';

INSERT INTO bodies (id, name, "carModelId", "productionStart", "productionEnd")
SELECT uuid_generate_v4(), 'C7', id, 2011, 2018
FROM car_models WHERE name = 'A6';