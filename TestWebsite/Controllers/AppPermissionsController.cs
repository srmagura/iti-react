using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestWebsite.Code;
using TestWebsite.Dto;

namespace TestWebsite.Controllers
{
    [Route("api/[Controller]/[Action]")]
    public class AppPermissionsController : ControllerBase
    {
        private bool EvaluatePermissionCore(string permissionName, List<string> args)
        {
            Guid G0()
            {
                return Guid.Parse(args[0]);
            }

            Guid G1()
            {
                return Guid.Parse(args[1]);
            }

            Guid customerGuid = Guid.Parse("643534f0-af21-41b1-b7f2-3e76cc407dcc");
            Guid vendorGuid = Guid.Parse("7f1e6ef0-4559-4d6a-b3df-f78e66ceaf76");

            switch (permissionName)
            {
                case PermissionNames.CanViewOrders:
                    return true;
                case PermissionNames.CanManageOrders:
                    return false;
                case PermissionNames.CanManageCustomer:
                    return G0() == customerGuid;
                case PermissionNames.CanManageVendor:
                    return G0() == vendorGuid;
                case PermissionNames.CanManageCustomerVendorMap:
                    return G0() == customerGuid && G1() == vendorGuid;
            }

            throw new Exception($"Unrecognized permission name: {permissionName}.");
        }

        private PermissionDto EvaluatePermission(string permissionName, List<string> args)
        {
            try
            {
                var isPermitted = EvaluatePermissionCore(permissionName, args);

                return new PermissionDto
                {
                    Name = permissionName,
                    Args = args,
                    IsPermitted = isPermitted
                };
            }
            catch (IndexOutOfRangeException e)
            {
                throw new Exception($"Did not receive the expected number of arguments for {permissionName}.", e);
            }
            catch (FormatException e)
            {
                throw new Exception($"Failed parsing an argument for {permissionName}.", e);
            }
        }

        /// <summary>
        /// A single API method that encapsulates MULTIPLE calls to IAppPermissions. 
        /// </summary>
        /// <param name="q">
        /// Plus-separated list of PermissionName+Arg1+Arg2+....
        /// Should not contain double quotes around args or permission name. This parameter may be sent multiple times.
        ///
        /// Example: api/appPermissions/get?q=CanRestartAdjudicationOrders&amp;q=CanUpdateUser+C6A5FFA8-4EA5-4CB2-BE6F-09369C72D9BD
        ///
        /// You are allowed to pass the same PermissionName more than once, with different arguments.
        /// </param>
        [HttpGet]
        public List<PermissionDto> Get(List<string> q)
        {
            var permissionDtos = new List<PermissionDto>();

            foreach (var queryTupleString in q)
            {
                List<string> queryTuple;

                try
                {
                    queryTuple = queryTupleString.Split(new[] { '+' }, StringSplitOptions.RemoveEmptyEntries).ToList();
                }
                catch (ArgumentException e)
                {
                    throw new Exception($"Invalid query tuple: {queryTupleString}", e);
                }

                if (queryTuple.Count == 0)
                    throw new Exception("Query tuple cannot have length 0.");

                if (queryTuple.Any(s => s == null))
                    throw new Exception("Query tuple must not contain nulls.");

                var permissionName = queryTuple[0];
                var args = queryTuple.Skip(1).ToList();

                permissionDtos.Add(EvaluatePermission(permissionName, args));
            }

            return permissionDtos;
        }
    }
}
