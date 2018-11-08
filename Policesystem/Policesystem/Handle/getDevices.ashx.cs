using DbComponent;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;

namespace Policesystem.Handle
{
    /// <summary>
    /// getDevices 的摘要说明
    /// </summary>
    public class getDevices : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string requesttype = context.Request.Form["requesttype"];
            StringBuilder sqltext = new StringBuilder();
            switch (requesttype)
            {
                case "all":
                case null://所有大队
                    sqltext.Append("SELECT TypeName,ID FROM [dbo].[DeviceType] ORDER by Sort");
                    break;
                case "huizong":
                    sqltext.Append("SELECT TypeName,ID FROM [dbo].[DeviceType] where ID<7  ORDER by Sort");
                    break;
                default:
                    break;
            }



            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "DB");

            context.Response.Write(JSON.DatatableToDatatableJS(dt, ""));
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}