namespace CAT.Models
{
    public class Company
    {
        public int ID { get; set; }
        public string? Name { get; set; }
        public int Size { get; set; }
        public List<Product>? Products { get; set; }
    }

    public class Product
    {
        public int ID { get; set; }
        public int CompanyID { get; set; }
        public string? Name { get; set; }
        public decimal Price { get; set; }
    }
}
