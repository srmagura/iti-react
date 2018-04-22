using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Website.Dto;
using Website.Util;

namespace Website.Controllers
{
    [Route("api/[controller]/[action]")]
    public class ProductController : BaseController
    {
        private static readonly List<ProductDto> Products = new List<ProductDto>
        {
            new ProductDto
            {
                Id = 1,
                Name = "Mouse",
            },
            new ProductDto
            {
                Id = 2,
                Name = "Keyboard",
            },
                new ProductDto
            {
                Id = 3,
                Name = "Headphones",
            },
            new ProductDto
            {
                Id = 4,
                Name = "Controller",
            },
        };

        public ProductDto Get(int id)
        {
            Thread.Sleep(2000);
            return Products.Single(p => p.Id == id);
        }

        public List<ProductDto> List()
        {
            Thread.Sleep(2000);
            return Products;
        }


        [HttpGet("NoContent")]
        public new IActionResult NoContent()
        {
            return base.NoContent();
        }

        [Route("InternalServerError")]
        [HttpGet]
        [HttpPost]
        public IActionResult InternalServerError()
        {
            throw new UserPresentableException("Here's the error message from the backend.");
        }
    }
}
