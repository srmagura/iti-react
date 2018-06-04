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
    [Route("api/[Controller]/[Action]")]
    public class ProductController
    {
        private readonly List<ProductDto> _products = new List<ProductDto>();
        private readonly Random _random = new Random();

        public ProductController()
        {
            for (var i = 0; i < 150; i++)
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
            return _products.Single(p => p.Id == id);
        }

        public ProductListDto List(string name, int page, int pageSize)
        {
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
    }
}
