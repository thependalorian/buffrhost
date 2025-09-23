-- Hospitality Indexes
-- Performance indexes for hospitality service tables

-- Menu System Indexes
CREATE INDEX idx_menu_category_property ON MenuCategory(property_id);
CREATE INDEX idx_menu_property ON Menu(property_id);
CREATE INDEX idx_menu_category ON Menu(category_id);
CREATE INDEX idx_menu_available ON Menu(is_available);
CREATE INDEX idx_menu_service_type ON Menu(service_type);
CREATE INDEX idx_menu_media_item ON MenuMedia(menu_item_id);

-- Modifiers and Options Indexes
CREATE INDEX idx_modifiers_property ON Modifiers(property_id);
CREATE INDEX idx_modifiers_service_type ON Modifiers(service_type);
CREATE INDEX idx_option_value_modifier ON OptionValue(modifiers_id);

-- Order Indexes
CREATE INDEX idx_order_property ON "Order"(property_id);
CREATE INDEX idx_order_customer ON "Order"(customer_id);
CREATE INDEX idx_order_status ON "Order"(status);
CREATE INDEX idx_order_date ON "Order"(order_date);
CREATE INDEX idx_order_service_type ON "Order"(service_type);
CREATE INDEX idx_order_item_order ON OrderItem(order_id);
CREATE INDEX idx_order_item_menu ON OrderItem(menu_item_id);

-- Room Management Indexes
CREATE INDEX idx_room_type_property ON RoomType(property_id);
CREATE INDEX idx_room_type_class ON RoomType(type_class);
CREATE INDEX idx_room_property ON Room(property_id);
CREATE INDEX idx_room_type ON Room(room_type_id);
CREATE INDEX idx_room_status ON Room(room_status);
CREATE INDEX idx_room_number ON Room(room_number);

-- Room Amenity Indexes
CREATE INDEX idx_room_amenity_property ON RoomAmenity(property_id);
CREATE INDEX idx_room_amenity_category ON RoomAmenity(amenity_category);

-- Room Reservation Indexes
CREATE INDEX idx_room_reservation_customer ON RoomReservation(customer_id);
CREATE INDEX idx_room_reservation_property ON RoomReservation(property_id);
CREATE INDEX idx_room_reservation_room ON RoomReservation(room_id);
CREATE INDEX idx_room_reservation_dates ON RoomReservation(check_in_date, check_out_date);
CREATE INDEX idx_room_reservation_status ON RoomReservation(reservation_status);

-- Room Rate Indexes
CREATE INDEX idx_room_rate_type ON RoomRate(room_type_id);
CREATE INDEX idx_room_rate_dates ON RoomRate(start_date, end_date);
CREATE INDEX idx_room_rate_type_name ON RoomRate(rate_type);

-- Room Service Indexes
CREATE INDEX idx_room_service_order_reservation ON RoomServiceOrder(reservation_id);
CREATE INDEX idx_room_service_order_room ON RoomServiceOrder(room_id);
CREATE INDEX idx_room_service_order_status ON RoomServiceOrder(order_status);
CREATE INDEX idx_room_service_item_order ON RoomServiceItem(room_service_id);

-- Service Booking Indexes
CREATE INDEX idx_spa_service_property ON SpaService(property_id);
CREATE INDEX idx_spa_service_category ON SpaService(category);
CREATE INDEX idx_conference_room_property ON ConferenceRoom(property_id);
CREATE INDEX idx_conference_room_capacity ON ConferenceRoom(capacity);
CREATE INDEX idx_transportation_service_property ON TransportationService(property_id);
CREATE INDEX idx_transportation_service_type ON TransportationService(service_type);
CREATE INDEX idx_recreation_service_property ON RecreationService(property_id);
CREATE INDEX idx_recreation_service_type ON RecreationService(service_type);
CREATE INDEX idx_specialized_service_property ON SpecializedService(property_id);
CREATE INDEX idx_specialized_service_type ON SpecializedService(service_type);
CREATE INDEX idx_service_booking_customer ON ServiceBooking(customer_id);
CREATE INDEX idx_service_booking_property ON ServiceBooking(property_id);
CREATE INDEX idx_service_booking_date ON ServiceBooking(booking_date);
CREATE INDEX idx_service_booking_status ON ServiceBooking(status);
