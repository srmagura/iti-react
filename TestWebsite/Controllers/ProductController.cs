using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using Microsoft.AspNetCore.Mvc;
using TestWebsite.Dto;
using TestWebsite.Util;

namespace TestWebsite.Controllers
{
    [Route("api/[Controller]/[Action]")]
    public class ProductController
    {
        private readonly List<ProductDto> _products = new List<ProductDto>();
        private readonly Random _random = new Random();

        public ProductController()
        {
            for (var i = 0; i < 55; i++)
            {
                string name;

                switch (i % 4)
                {
                    case 0:
                        name = "Headphones";
                        break;
                    case 1:
                        name = "Mouse";
                        break;
                    case 2:
                        name = "Keyboard";
                        break;
                    case 3:
                        name = "Monitor";
                        break;
                    default:
                        throw new Exception();
                }

                name += $" (model no. {i})";

                _products.Add(new ProductDto
                {
                    Id = i,
                    Name = name
                });
            }
        }

        public ProductDto Get(int id)
        {
            Thread.Sleep(800);

            return _products.Single(p => p.Id == id);
        }

        public ProductListDto List(string name, int page, int pageSize)
        {
            Thread.Sleep(800);

            var products = _products;

            if (name != null)
            {
                products = products.Where(p => p.Name.ContainsIgnoreCase(name)).ToList();
            }

            products = products.OrderBy(p => p.Id).ToList();

            // Randomize stock so we can confirm the UI auto refreshes the data
            foreach (var product in products)
            {
                product.Stock = _random.Next(0, 200);
            }

            return new ProductListDto
            {
                Products = products.Skip((page - 1) * pageSize).Take(pageSize).ToList(),
                TotalFilteredCount = products.Count
            };
        }

        public IActionResult InternalServerError()
        {
            throw new UserPresentableException("Here's the error message from the backend.");
        }

        public object IsValid(string s)
        {
            Thread.Sleep(1200);
            return new
            {
                Valid = s != null && s.ToLowerInvariant().Contains("cool"),
                Reason = "Does not contain \"cool\"."
            };
        }

        public object IsValid2(string s)
        {
            Thread.Sleep(800);
            return new
            {
                Valid = s != null && s.ToLowerInvariant().Contains("nice"),
                Reason = "Does not contain \"nice\"."
            };
        }

        public class PerformOperationRequestBody
        {
            public bool Error { get; set; }
        }

        [HttpPost]
        public void PerformOperation([FromBody] PerformOperationRequestBody body)
        {
            Thread.Sleep(400);

            if(body.Error)
            {
                throw new UserPresentableException("PerformOperation encountered an error.");
            }
        }
    }
}
