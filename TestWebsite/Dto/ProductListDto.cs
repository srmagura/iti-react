using System.Collections.Generic;

namespace TestWebsite.Dto
{
    public class ProductListDto
    {
        public List<ProductDto> Products { get; set; }
        public int TotalPages { get; set; }
    }
}