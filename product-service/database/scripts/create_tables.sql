create extension if not exists "uuid-ossp";

create table if not exists product (
	id uuid not null primary key default uuid_generate_v4(),
	title text not null,
	description text not null,
	price bigint not null default 0
);

create table if not exists stocks (
  product_id uuid primary key,
  count bigint not null default 0,
  foreign key (product_id) references products (id) on delete cascade
);