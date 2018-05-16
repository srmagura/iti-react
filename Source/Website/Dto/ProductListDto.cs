using System.Collections.Generic;

namespace Website.Dto
{
    public class ProductListDto
    {
        public List<ProductDto> Products { get; set; }
        public int TotalPages { get; set; }
    }
}