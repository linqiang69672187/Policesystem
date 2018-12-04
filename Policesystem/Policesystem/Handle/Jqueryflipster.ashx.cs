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
    /// 首页大屏大队轮播页面;
    /// </summary>
    public class Jqueryflipster : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            StringBuilder sqltext = new StringBuilder();
            StringBuilder json = new StringBuilder();
            string dwmc = "";
            string sbSQL = "";

            //HttpCookie cookie = new HttpCookie("cookieName");
            //cookie.Value = "331001000000";
            //HttpContext.Current.Response.Cookies.Add(cookie);

            HttpCookie cookies = HttpContext.Current.Request.Cookies["cookieName"];

            DataTable allentitys = SQLHelper.ExecuteRead(CommandType.Text, "SELECT BMDM,BMMC,SJBM FROM [dbo].[Entity]", "1");

            List<entityStruct> rows;

            string BMDM = "331001000000";
            if (cookies != null)
            {
                BMDM = cookies["BMDM"];
            }
            switch (BMDM)
            {
                case "331000000000":
                    rows = (from p in allentitys.AsEnumerable()
                            where (p.Field<string>("SJBM")== "331000000000") ||(p.Field<string>("BMDM")== "331000000000" && p.Field<string>("BMMC").StartsWith("台州市交通警察支队直属") )
                            orderby p.Field<int>("sort") descending
                            select new entityStruct
                            {
                                BMDM = p.Field<string>("BMDM"),
                                SJBM = p.Field<string>("SJBM"),
                                BMMC = p.Field<string>("BMMC")
                            }).ToList<entityStruct>();
                    sbSQL = "SELECT BMMC,BMDM from [Entity] where  BMDM ='331000000000' OR ([SJBM] = '331000000000' and BMMC like '台州市交通警察支队直属%')  order by Sort desc"; //目前只需要查询四个大队
                    break;
                case "331001000000":
                case "331002000000":
                case "331003000000":
                case "331004000000":
                    sbSQL = " SELECT BMMC,BMDM from [Entity] where BMDM = '"+BMDM+ "' or [SJBM]='"+BMDM+"'  order BY CASE WHEN Sort IS NULL THEN 1 ELSE Sort END desc";
                    break;
                default:
                    sbSQL = "SELECT BMMC,BMDM from [Entity] where [BMDM] = '"+BMDM+"' "; //目前只需要查询四个大队
                    break;
            }
            DataTable dtfrist = SQLHelper.ExecuteRead(CommandType.Text, sbSQL, "1");
            DataTable configs = SQLHelper.ExecuteRead(CommandType.Text, "SELECT val FROM [dbo].[IndexConfigs] where id =7", "1");




            json.Append("[");
            for (int i1 = 0; i1 < dtfrist.Rows.Count; i1++)
            {
                dwmc =(dtfrist.Rows[i1]["BMDM"].ToString()== "331000000000")?"交警支队": dtfrist.Rows[i1]["BMMC"].ToString().Substring(11);
          
                if (i1 > 0)
                {
                    json.Append(',');
                };
                json.Append("{\"Name\":");
                json.Append('"');
                json.Append(dwmc);
                json.Append('"');
                json.Append(",\"BMDM\":");
                json.Append('"');
                json.Append(dtfrist.Rows[i1]["BMDM"].ToString());
                json.Append('"');
                json.Append(",\"squee\":");
                json.Append('"');
                json.Append(configs.Rows[0]["val"].ToString());
                json.Append('"');
                json.Append(',');
                sqltext.Append("WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM= '"+ dtfrist.Rows[i1]["BMDM"].ToString() + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) SELECT count(a.id) count, c.TypeName, sum((CASE WHEN([OnlineTime] +[HandleCnt]) > 0 THEN 1 ELSE 0 END)) Isused,sum([IsOnline]) online from Device a  LEFT JOIN Gps B ON a.DevId = B.PDAID  LEFT JOIN DeviceType C ON a.DevType = c.ID  where BMDM in (SELECT BMDM from childtable UNION all SELECT '" + dtfrist.Rows[i1]["BMDM"].ToString() + "') GROUP By c.TypeName ");
                DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "DB");
                sqltext.Clear();
                json.Append(JSON.DatatableToJS(dt, "").ToString());
            }
            json.Append("]");
            context.Response.Write(json.ToString());
        }

        public class entityStruct
        {
            public string BMDM;
            public string SJBM;
            public string BMMC;
        }
        public IEnumerable<entityStruct> GetSonID(string p_id,DataTable allEntitys)
        {
            try
            {
                var query = (from p in allEntitys.AsEnumerable()
                             where (p.Field<string>("SJBM") == p_id)
                             select new entityStruct
                             {
                                 BMDM = p.Field<string>("BMDM"),
                                 SJBM = p.Field<string>("SJBM"),
                                 BMMC = p.Field<string>("BMMC")
                             }).ToList<entityStruct>();
                return query.ToList().Concat(query.ToList().SelectMany(t => GetSonID(t.BMDM,allEntitys)));
            }
            catch (Exception e)
            {
                return null;
            }

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