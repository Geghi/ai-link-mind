DO $$
DECLARE
    table_name_var TEXT;
    policy_name_var TEXT;
BEGIN
    -- Loop through all tables in the public schema
    FOR table_name_var IN
        SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    LOOP
        -- For each table, loop through all its policies
        FOR policy_name_var IN
            SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = table_name_var
        LOOP
            -- Dynamically construct and execute the DROP POLICY command
            EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(policy_name_var) || ' ON public.' || quote_ident(table_name_var) || ';';
            RAISE NOTICE 'Dropped policy "%" on table "%"', policy_name_var, table_name_var;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
