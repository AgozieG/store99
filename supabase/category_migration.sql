-- Run this once in the Supabase SQL Editor for an existing Store 99 project.
-- It updates the database validation and converts the previous category values.
alter table public.products drop constraint if exists products_category_check;

update public.products
set category = case category
  when 'hoodies' then 'HOODIES'
  when 'shirts' then 'TEES'
  when 'shorts' then 'TROUSERS/SHORTS'
  when 'trousers' then 'TROUSERS/SHORTS'
  when 'shoes' then 'FOOTWEARS'
  when 'accessories' then 'CAPS'
  else category
end;

alter table public.products
  add constraint products_category_check
  check (category in (
    'HOODIES', 'JEANS', 'TROUSERS/SHORTS', 'TEES', 'POLO', 'CAPS',
    'TRACKSUITS', 'KICKS/BOOTS', 'FOOTWEARS', 'BRIEFS', 'BELTS'
  ));
