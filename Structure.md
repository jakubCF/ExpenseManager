## current structure of db - do not change

CREATE TABLE IF NOT EXISTS public.chrisexp
(
    id integer NOT NULL DEFAULT nextval('chrisexp_id_seq'::regclass),
    created_at date,
    store_name character varying(128) COLLATE pg_catalog."default",
    store_address text COLLATE pg_catalog."default",
    store_phone text COLLATE pg_catalog."default",
    date_of_purchase date,
    subtotal numeric(10,2),
    gst numeric(10,2),
    hst numeric(10,2),
    total numeric(10,2),
    total_discounts numeric(10,2),
    payment_method text COLLATE pg_catalog."default",
    line_items jsonb,
    file_name character varying(256) COLLATE pg_catalog."default",
    approved boolean NOT NULL DEFAULT false,
    CONSTRAINT chrisexp_pkey PRIMARY KEY (id)
)

PostgreSQL
IP: 127.0.0.1
database: personal

### line_items
[
    {
      "name": "string",
      "price": "number",
      "quantity": "number",
      "discount": "number",
      "net_price": "number",
      "tax_ght_hst": "number",
      "included": "bool"
    }
]

## s3 images location

minios3
http://127.0.0.1
bucket: chris-expenses
api access: minio:minio123

file_name in db is filename in s3 bucket