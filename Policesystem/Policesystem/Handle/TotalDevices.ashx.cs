using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using DbComponent;

namespace Policesystem.Handle
{
    /// <summary>
    /// 获取总设备数、总执法量、总在线数、总在线时长
    /// </summary>
    public class TotalDevices : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            StringBuilder sqltext = new StringBuilder();
            //
            sqltext.Append("SELECT count(ID) as value,0 as value2 FROM [Device] union all SELECT  sum(HandleCnt) as value,SUM([OnlineTime]) as value2  FROM StatsInfo_Yestorday_Today where Time > GETDATE()-1 union all SELECT  count(id) as value1,0 as value2 FROM [Gps] where IsOnline='1'");

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