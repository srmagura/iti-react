using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dto
{
    public class PermissionDto
    {
        public string Name { get; set; }
        public List<string> Args { get; set; }
        public bool IsPermitted { get; set; }
    }
}
