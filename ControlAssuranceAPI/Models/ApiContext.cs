﻿using Microsoft.EntityFrameworkCore;

namespace CAT.Models
{
    public class ApiContext : DbContext
    {
        public ApiContext(DbContextOptions<ApiContext> options)
            : base(options)
        {
        }
        public DbSet<Company> Companies { get; set; }
        public DbSet<Product> Products { get; set; }
    }
}
