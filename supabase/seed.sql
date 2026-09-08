-- Seed Breeds
INSERT INTO breeds (name, species, description, characteristics) VALUES
('Golden Retriever', 'Dog', 'Friendly, tolerant, and intelligent.', '{"energy": "high", "temperament": "gentle", "size": "large"}'),
('Siamese', 'Cat', 'Active, affectionate, and vocal.', '{"energy": "medium", "temperament": "social", "size": "small"}'),
('Beagle', 'Dog', 'Curious, merry, and energetic.', '{"energy": "high", "temperament": "playful", "size": "medium"}'),
('Maine Coon', 'Cat', 'Gentle giants, fluffy and intelligent.', '{"energy": "medium", "temperament": "calm", "size": "large"}'),
('German Shepherd', 'Dog', 'Confident, courageous, and smart.', '{"energy": "high", "temperament": "loyal", "size": "large"}'),
('Persian', 'Cat', 'Quiet, sweet, and fluffy.', '{"energy": "low", "temperament": "docile", "size": "medium"}');

-- Seed Hospitals
INSERT INTO hospitals (name, address, specialties, rating, contact_info) VALUES
('City Pet Hospital', '123 Main St, Downtown', '{"Surgery", "General Care", "Emergency"}', 4.8, '{"phone": "555-0101", "email": "info@citypet.com"}'),
('Happy Paws Clinic', '456 Oak Ave, Suburbia', '{"Vaccinations", "Pediatrics", "Dental"}', 4.5, '{"phone": "555-0202", "email": "contact@happypaws.com"}'),
('VetCare Specialist Center', '789 Pine Rd, Northside', '{"Cardiology", "Orthopedics", "Neurology"}', 4.9, '{"phone": "555-0303", "email": "care@vetcare.com"}'),
('Green Valley Animal Hospital', '101 Maple Dr, Eastside', '{"Exotics", "Avian", "Reptiles"}', 4.2, '{"phone": "555-0404", "email": "hello@greenvalley.com"}');
