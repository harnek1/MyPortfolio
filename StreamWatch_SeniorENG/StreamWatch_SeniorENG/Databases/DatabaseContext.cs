using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System;

namespace StreamWatch_SeniorENG.Databases
{

    //this class helps us interact with the database
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
        }

        //DbSet objects created in order to help interact with database
        public DbSet<User> User { get; set; }
        public DbSet<Search> Search { get; set; }
        public DbSet<Notification> Notification { get; set; }

        public DbSet<Calendar> Calendar { get; set; }

    }
}
