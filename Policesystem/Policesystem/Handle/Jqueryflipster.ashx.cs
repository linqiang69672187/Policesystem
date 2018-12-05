using DbComponent;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
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

            DataTable allentitys = SQLHelper.ExecuteRead(CommandType.Text, "SELECT BMDM,BMMC,SJBM,(CASE WHEN sort IS NULL THEN -1 ELSE sort END) AS sort FROM [dbo].[Entity]", "1");
            DataTable dt;
            List<entityStruct> rows;
            List<gps> rowsx;
            string BMDM = "331000000000";
            if (cookies != null)
            {
                BMDM = cookies["BMDM"];
            }
            switch (BMDM)
            {
                case "331000000000":
                    rows = (from p in allentitys.AsEnumerable()
                            where (p.Field<string>("SJBM")== "331000000000" && p.Field<string>("BMMC").StartsWith("台州市交通警察支队直属")) ||(p.Field<string>("BMDM")== "331000000000"  )
                            orderby p.Field<int>("sort") descending
                            select new entityStruct
                            {
                                BMDM = p.Field<string>("BMDM"),
                                SJBM = p.Field<string>("SJBM"),
                                BMMC = p.Field<string>("BMMC")
                            }).ToList<entityStruct>();
                    // sbSQL = "SELECT BMMC,BMDM from [Entity] where  BMDM ='331000000000' OR ([SJBM] = '331000000000' and BMMC like '台州市交通警察支队直属%')  order by Sort desc"; //目前只需要查询四个大队
                     dt = SQLHelper.ExecuteRead(CommandType.Text, "WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM in ('331001000000','331002000000','331003000000','331004000000') OR BMDM  in ('331001000000','331002000000','331003000000','331004000000') UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM )  SELECT count(a.id) count,BMDM, c.TypeName, sum((CASE WHEN([OnlineTime] +[HandleCnt]) > 0 THEN 1 ELSE 0 END)) Isused,sum((CASE WHEN [IsOnline] is null  THEN 0 ELSE [IsOnline] END)) online from Device a  LEFT JOIN Gps B ON a.DevId = B.PDAID  LEFT JOIN DeviceType C ON a.DevType = c.ID where BMDM in (SELECT BMDM FROM childtable)  GROUP By c.TypeName,BMDM", "1");

                    break;
                case "331001000000":
                case "331002000000":
                case "331003000000":
                case "331004000000":
                    rows = (from p in allentitys.AsEnumerable()
                            where (p.Field<string>("SJBM") == "+BMDM+") || (p.Field<string>("BMDM") == "+BMDM+")
                            orderby p.Field<int>("sort") descending
                            select new entityStruct
                            {
                                BMDM = p.Field<string>("BMDM"),
                                SJBM = p.Field<string>("SJBM"),
                                BMMC = p.Field<string>("BMMC")
                            }).ToList<entityStruct>();
                    //  sbSQL = " SELECT BMMC,BMDM from [Entity] where BMDM = '"+BMDM+ "' or [SJBM]='"+BMDM+"'  order BY CASE WHEN Sort IS NULL THEN 1 ELSE Sort END desc";
                    dt = SQLHelper.ExecuteRead(CommandType.Text, "WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM ='"+BMDM+"' OR BMDM ='"+BMDM+"' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM )  SELECT count(a.id) count,BMDM, c.TypeName, sum((CASE WHEN([OnlineTime] +[HandleCnt]) > 0 THEN 1 ELSE 0 END)) Isused,sum((CASE WHEN [IsOnline] is null  THEN 0 ELSE [IsOnline] END)) online from Device a  LEFT JOIN Gps B ON a.DevId = B.PDAID  LEFT JOIN DeviceType C ON a.DevType = c.ID where BMDM in (SELECT BMDM FROM childtable)  GROUP By c.TypeName,BMDM", "1");

                    break;
                default:
                    rows = (from p in allentitys.AsEnumerable()
                            where  (p.Field<string>("BMDM") == "+BMDM+")
                            orderby p.Field<int>("sort") descending
                            select new entityStruct
                            {
                                BMDM = p.Field<string>("BMDM"),
                                SJBM = p.Field<string>("SJBM"),
                                BMMC = p.Field<string>("BMMC")
                            }).ToList<entityStruct>();
                    // sbSQL = "SELECT BMMC,BMDM from [Entity] where [BMDM] = '"+BMDM+"' "; //目前只需要查询四个大队
                    dt = SQLHelper.ExecuteRead(CommandType.Text, "WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM ='" + BMDM + "' OR BMDM ='" + BMDM + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM )  SELECT count(a.id) count,BMDM, c.TypeName, sum((CASE WHEN([OnlineTime] +[HandleCnt]) > 0 THEN 1 ELSE 0 END)) Isused,sum((CASE WHEN [IsOnline] is null  THEN 0 ELSE [IsOnline] END)) online from Device a  LEFT JOIN Gps B ON a.DevId = B.PDAID  LEFT JOIN DeviceType C ON a.DevType = c.ID where BMDM in (SELECT BMDM FROM childtable)  GROUP By c.TypeName,BMDM", "1");

                    break;
            }

            DataTable configs = SQLHelper.ExecuteRead(CommandType.Text, "SELECT val FROM [dbo].[IndexConfigs] where id =7", "1");

            int i1 = 0;
            List<string> strList = new List<string>();


            json.Append("[");
            foreach (entityStruct item in rows)
            {
                dwmc =(item.BMDM== "331000000000")?"交警支队": item.BMMC.Substring(11);
           
                    var entityids = GetSonID(item.BMDM, allentitys);
                    strList.Add(item.BMDM);
                    foreach (entityStruct itemx in entityids)
                    {
                        strList.Add(itemx.BMDM);
                    }
               

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
                json.Append(item.BMDM.ToString());
                json.Append('"');
                json.Append(",\"squee\":");
                json.Append('"');
                json.Append(configs.Rows[0]["val"].ToString());
                json.Append('"');
                json.Append(',');
                //sqltext.Append("WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM= '"+ dtfrist.Rows[i1]["BMDM"].ToString() + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) SELECT count(a.id) count, c.TypeName, sum((CASE WHEN([OnlineTime] +[HandleCnt]) > 0 THEN 1 ELSE 0 END)) Isused,sum([IsOnline]) online from Device a  LEFT JOIN Gps B ON a.DevId = B.PDAID  LEFT JOIN DeviceType C ON a.DevType = c.ID  where BMDM in (SELECT BMDM from childtable UNION all SELECT '" + dtfrist.Rows[i1]["BMDM"].ToString() + "') GROUP By c.TypeName ");
                //DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "DB");
                // sqltext.Clear();
                // json.Append(JSON.DatatableToJS(dt, "").ToString());
                rowsx = (from p in dt.AsEnumerable()
                         where strList.ToArray().Contains(p.Field<string>("BMDM"))
                         group p by new { t1 = p.Field<string>("TypeName") } into g
                         select new gps
                         {
                             TypeName=g.Key.t1,
                             count = g.Sum(p => (p.Field<Int32>("count"))),
                             Isused = g.Sum(p => (p.Field<Int32>("Isused"))),
                             online = g.Sum(p => (p.Field<Int32>("online")))
                         }).ToList<gps>();
                DataTable dtx = ToDataTable(rowsx);
                json.Append(JSON.DatatableToJS(dtx, "").ToString());
                i1 += 1;
                strList.Clear();
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

        public class gps
        {
            public Int32 count;
            public string TypeName;
            public Int32 Isused;
            public Int32 online;
        }
        public IEnumerable<entityStruct> GetSonID(string p_id,DataTable allEntitys)
        {
            List<entityStruct> query;
            try
            {    if (p_id == "331000000000") {
                    query = (from p in allEntitys.AsEnumerable()
                             where (p.Field<string>("SJBM") == "331000000000" && p.Field<string>("BMMC").StartsWith("台州市交通警察支队直属"))
                             select new entityStruct
                             {
                                 BMDM = p.Field<string>("BMDM"),
                                 SJBM = p.Field<string>("SJBM"),
                                 BMMC = p.Field<string>("BMMC")
                             }).ToList<entityStruct>();
                }
                else { 
                 query = (from p in allEntitys.AsEnumerable()
                             where (p.Field<string>("SJBM") == p_id)
                             select new entityStruct
                             {
                                 BMDM = p.Field<string>("BMDM"),
                                 SJBM = p.Field<string>("SJBM"),
                                 BMMC = p.Field<string>("BMMC")
                             }).ToList<entityStruct>();
                }
                return query.ToList().Concat(query.ToList().SelectMany(t => GetSonID(t.BMDM,allEntitys)));
            }
            catch (Exception e)
            {
                return null;
            }

        }

        /// <summary>    
        /// 将集合类转换成DataTable    
        /// </summary>    
        /// <param name="list">集合</param>    
        /// <returns></returns>    
        public static DataTable ToDataTable( List<gps> items)
        {
            DataTable dataTable = new DataTable();

            dataTable.Columns.Add("count");
            dataTable.Columns.Add("TypeName");
            dataTable.Columns.Add("Isused");
            dataTable.Columns.Add("online");


            foreach (gps obj in items)
            {
                DataRow dr = dataTable.NewRow();
                dr["count"] = obj.count;
                dr["TypeName"] = obj.TypeName;
                dr["Isused"] = obj.Isused;
                dr["online"] = obj.online;
                dataTable.Rows.Add(dr);
            }

            return dataTable;
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