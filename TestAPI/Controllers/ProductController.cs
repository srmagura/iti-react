using System.Net;
using Microsoft.AspNetCore.Mvc;
using TestAPI.DTOs;

namespace TestAPI.Controllers;

public class ProductController : ControllerBase
{
    private readonly List<ProductDto> _products = new();

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

            _products.Add(new ProductDto(i, name));
        }
    }

    public List<ProductDto> List(string name)
    {
        var products = _products;

        if (name != null)
        {
            products = products.Where(p => p.Name.Contains(name, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        return products.OrderBy(p => p.Id).ToList();
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

    public record PerformOperationRequestBody(bool Error);

    [HttpPost]
    public IActionResult PerformOperation([FromBody] PerformOperationRequestBody body)
    {
        Thread.Sleep(400);

        if (body.Error)
        {
            return new ObjectResult("PerformOperation encountered an error.")
            {
                StatusCode = (int)HttpStatusCode.InternalServerError
            };
        }

        return NoContent();
    }
}
