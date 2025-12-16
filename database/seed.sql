-- 1. Clear existing data (Optional - use with caution!)
-- TRUNCATE public.leads, public.users RESTART IDENTITY CASCADE;

-- 2. Insert Sample Users
INSERT INTO public.users (user_name, email, password, role)
VALUES 
('Alice Sales', 'alice@company.com', 'hashed_pass_1', 'Manager'),
('Bob Closer', 'bob@company.com', 'hashed_pass_2', 'Agent'),
('Charlie Scout', 'charlie@company.com', 'hashed_pass_3', 'Agent'),
('Diana Lead', 'diana@company.com', 'hashed_pass_4', 'admin');

-- 3. Insert Randomized Leads linked to the users above
INSERT INTO public.leads (
    client_name, 
    deal_description, 
    deal_value, 
    column_name, 
    column_entry_time, 
    last_activity_at, 
    lead_source, 
    user_id
)
SELECT 
    -- Random Client Names
    (ARRAY['Acme Corp', 'Globex', 'Soylent Corp', 'Initech', 'Umbrella Co', 'Hooli'])[floor(random() * 6 + 1)],
    -- Random Descriptions
    (ARRAY['Software License', 'Consulting Services', 'Cloud Migration', 'Hardware Refresh'])[floor(random() * 4 + 1)],
    -- Random Deal Value between 1,000 and 50,000
    (random() * 49000 + 1000)::numeric(10,2),
    -- Random Pipeline Stage
    (ARRAY['In Progress', 'Closed Lost', 'Closed Won'])[floor(random() * 3+ 1)],
    -- Column Entry Time (within last 30 days)
    NOW() - (random() * interval '30 days'),
    -- Last Activity (within last 5 days)
    NOW() - (random() * interval '5 days'),
    -- Lead Source
    (ARRAY['LinkedIn', 'Website', 'Referral', 'Cold Call'])[floor(random() * 4 + 1)],
    -- Randomly assign to one of the 4 users we just created
    (SELECT id FROM public.users ORDER BY random() LIMIT 1)
FROM generate_series(1, 20); -- Generates 20 sample leads