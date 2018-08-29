using DbComponent;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Policesystem.Handle
{
    /// <summary>
    /// saveindexconfig 的摘要说明
    /// </summary>
    public class saveindexconfig : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string Row1 = context.Request.Form["Row1"];
            string val1 = context.Request.Form["val1"];
            string Row2 = context.Request.Form["Row2"];
            string val2 = context.Request.Form["val2"];
            string Row3 = context.Request.Form["Row3"];
            string val3 = context.Request.Form["val3"];

            SqlParameter[] sp = new SqlParameter[3];
            sp[0] = new SqlParameter("@id", 1);
            sp[1] = new SqlParameter("@DevType", Row1);
            sp[2] = new SqlParameter("@val", val1);
            SQLHelper.ExecuteNonQuery(CommandType.Text, "update IndexConfigs set DevType=@DevType,val=@val where id = @id", sp);

            SqlParameter[] sp1 = new SqlParameter[3];
            sp1[0] = new SqlParameter("@id", 2);
            sp1[1] = new SqlParameter("@DevType", Row2);
            sp1[2] = new SqlParameter("@val", val2);
            SQLHelper.ExecuteNonQuery(CommandType.Text, "update IndexConfigs set DevType=@DevType,val=@val where id = @id", sp1);

            SqlParameter[] sp2 = new SqlParameter[3];
            sp2[0] = new SqlParameter("@id", 3);
            sp2[1] = new SqlParameter("@DevType", Row3);
            sp2[2] = new SqlParameter("@val", val3);
            SQLHelper.ExecuteNonQuery(CommandType.Text, "update IndexConfigs set DevType=@DevType,val=@val where id = @id", sp2);

            context.Response.Write("1");
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