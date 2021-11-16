using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestWebsite.Code
{
    public static class PermissionNames
    {
        public const string CanViewOrders = nameof(CanViewOrders);
        public const string CanManageOrders = nameof(CanManageOrders);
        public const string CanManageCustomer = nameof(CanManageCustomer);
        public const string CanManageVendor = nameof(CanManageVendor);
        public const string CanManageCustomerVendorMap = nameof(CanManageCustomerVendorMap);
    }
}
