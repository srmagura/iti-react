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
            return Products.Single(p => p.Id == id);
        }

        public class ProductListDto
        {
            public List<ProductDto> Products { get; set; }
            public int TotalPages { get; set; }
        }

        public ProductListDto List(string nameFilter, int page, int pageSize)
        {
            var products = Products.Where(p => p.Name.Contains(nameFilter)).ToList();

            return new ProductListDto
            {
                Products = products.Skip((page - 1) * pageSize).Take(pageSize).ToList(),
                TotalPages = (int)Math.Ceiling((double)products.Count / pageSize)
            };
        }

        public IActionResult InternalServerError()
        {
            throw new UserPresentableException("Here's the error message from the backend.");
        }

        public object IsValid(string s)
        {
            Thread.Sleep(800);
            return new
            {
                Valid = s != null && s.ToLowerInvariant().Contains("cool"),
                Reason = "I don't like it."
            };
        }
    }
}
