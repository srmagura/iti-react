using System.Collections.Generic;

namespace Dto
{
    public class ProductListDto
    {
        public List<ProductDto> Products { get; set; }
        public int TotalFilteredCount { get; set; }
    }
}