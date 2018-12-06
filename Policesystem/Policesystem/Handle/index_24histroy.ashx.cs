using DbComponent;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace Policesystem.Handle
{
    /// <summary>
    /// index_24histroy 的摘要说明
    /// </summary>
    public class index_24histroy : IHttpHandler
    {
        DataTable allEntitys = null;  //递归单位信息表


        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            string historydetype = context.Request.Form["historydetype"];
            DataTable histroyreal = null;  //24小时数据表
            DataTable dtEntitys = null;   //递归单位表

            HttpCookie cookies = HttpContext.Current.Request.Cookies["cookieName"];
            string BMDM = "331000000000";
            if (cookies != null)
            {
                BMDM = cookies["BMDM"];
            }
            switch (BMDM)
            {
                case "331000000000":
                    dtEntitys = SQLHelper.ExecuteRead(CommandType.Text, "SELECT BMDM,SJBM from [Entity] where SJBM ='" + BMDM + "'  AND BMDM <> '33100000000x' ", "11");
                    break;
                case "331001000000":
                case "331002000000":
                case "331003000000":
                case "331004000000":
                    dtEntitys = SQLHelper.ExecuteRead(CommandType.Text, "SELECT BMDM,SJBM from [Entity] where SJBM ='" + BMDM + "'", "11");
                    break;
                default:
                    dtEntitys = SQLHelper.ExecuteRead(CommandType.Text, "SELECT BMDM,SJBM from [Entity] where BMDM ='" + BMDM + "'", "11");
                    break;
            }
            histroyreal = SQLHelper.ExecuteRead(CommandType.Text, "SELECT BMDM,[Time], CONVERT(nvarchar(20),DevType) as DevType,count(ID) sl,SUM((CASE WHEN [OnlineTime] is null  THEN 0 ELSE [OnlineTime] END)) OnlineTime,sum((CASE WHEN [HandleCnt] is null  THEN 0 ELSE [HandleCnt] END)) HandleCnt,SUM((CASE WHEN [CXCNT] is null  THEN 0 ELSE [CXCNT] END)) CXCNT,SUM((CASE WHEN [FileSize] is null  THEN 0 ELSE [FileSize] END)) FileSize,SUM((CASE WHEN [SCL] is null  THEN 0 ELSE [SCL] END)) SCL,SUM((CASE WHEN [GFSCL] is null  THEN 0 ELSE [GFSCL] END)) GFSCL,sum((CASE WHEN([OnlineTime] +[HandleCnt]) > 0 THEN 1 ELSE 0 END)) onlinecount FROM [dbo].[StatsInfo_RealTime] st  WHERE BMDM <> '' and  DevType in (" + historydetype+")  GROUP BY BMDM,[Time],DevType ORDER BY BMDM,[DevType],[TIME]", "histroyreal");

            allEntitys = SQLHelper.ExecuteRead(CommandType.Text, "SELECT BMDM,SJBM from [Entity] ", "11");


            DataTable dtreturns = new DataTable(); //返回数据表
            dtreturns.Columns.Add("BMDM");
            dtreturns.Columns.Add("Time");
            dtreturns.Columns.Add("DevType");
            dtreturns.Columns.Add("HandleCnt");
            dtreturns.Columns.Add("CXCNT");
            dtreturns.Columns.Add("FileSize");
            dtreturns.Columns.Add("SCL");
            dtreturns.Columns.Add("GFSCL");
            dtreturns.Columns.Add("sl");
            dtreturns.Columns.Add("OnlineTime");
            dtreturns.Columns.Add("onlinecount");
            for (int i1 = 0; i1 < dtEntitys.Rows.Count; i1++)
            {
                var entityids = GetSonID(dtEntitys.Rows[i1]["BMDM"].ToString());
                List<string> strList = new List<string>();

                strList.Add(dtEntitys.Rows[i1]["BMDM"].ToString());
                foreach (entityStruct item in entityids)
                {
                    strList.Add(item.BMDM);
                }

                List<gps> rows = (from p in histroyreal.AsEnumerable()
                                  where strList.ToArray().Contains(p.Field<string>("BMDM"))
                                  group p by new { t1 = p.Field<string>("DevType"), t2 = p.Field<DateTime>("Time") } into g
                                  select new gps
                                  {
                                      BMDM = dtEntitys.Rows[i1]["BMDM"].ToString(),
                                      Time = g.Key.t2,
                                      DevType = g.Key.t1,
                                      HandleCnt = g.Sum(p => p.Field<Int64>("HandleCnt")),
                                      CXCNT = g.Sum(p => p.Field<Int64>("CXCNT")),
                                      FileSize = g.Sum(p => p.Field<Int64>("FileSize")),
                                      SCL = g.Sum(p => p.Field<double>("SCL")),
                                      GFSCL = g.Sum(p => p.Field<double>("GFSCL")),
                                      sl = g.Sum(p => p.Field<Int32>("sl")),
                                      OnlineTime = g.Sum(p => p.Field<Int64>("OnlineTime")),
                                      onlinecount = g.Sum(p => p.Field<Int32>("onlinecount")),
                                          }).ToList<gps>();

                foreach (gps item in rows)
                {
                    DataRow dr = dtreturns.NewRow();

                    dr["BMDM"] = item.BMDM;
                    dr["Time"] = item.Time;
                    dr["DevType"] = item.DevType;
                    dr["HandleCnt"] = item.HandleCnt;
                    dr["CXCNT"] = item.CXCNT;
                    dr["FileSize"] = item.FileSize;
                    dr["SCL"] = item.SCL;
                    dr["GFSCL"] = item.GFSCL;
                    dr["sl"] = item.sl;
                    dr["OnlineTime"] = item.OnlineTime;
                    dr["onlinecount"] = item.onlinecount;
                    dtreturns.Rows.Add(dr);
                }




            }

            var rowtotal = from p in dtreturns.AsEnumerable()
                           group p by new { Time = p.Field<string>("Time"), DevType = p.Field<string>("DevType") }
                   into s
                           select new
                           {
                               BMDM = BMDM,
                               Time = s.Key.Time,
                               DevType = s.Key.DevType,
                               HandleCnt = s.Sum(p =>
                               {
                                   try
                                   {
                                       return Convert.ToInt64(p.Field<string>("HandleCnt"));
                                   }
                                   catch (Exception e)
                                   {
                                       return 0;
                                   };
                               }),
                               CXCNT = s.Sum(p =>
                               {
                                   try
                                   {
                                       return Convert.ToInt64(p.Field<string>("CXCNT"));
                                   }
                                   catch (Exception e)
                                   {
                                       return 0;
                                   };
                               }),
                               FileSize = s.Sum(p =>
                               {
                                   try
                                   {
                                       return Convert.ToInt64(p.Field<string>("FileSize"));
                                   }
                                   catch (Exception e)
                                   {
                                       return 0;
                                   };
                               }),
                               SCL = s.Sum(p =>
                               {
                                   try
                                   {
                                       return Convert.ToDouble(p.Field<string>("SCL"));
                                   }
                                   catch (Exception e)
                                   {
                                       return 0;
                                   };
                               }),
                               GFSCL = s.Sum(p =>
                               {
                                   try
                                   {
                                       return Convert.ToDouble(p.Field<string>("GFSCL"));
                                   }
                                   catch (Exception e)
                                   {
                                       return 0;
                                   };
                               }),
                               sl = s.Sum(p =>
                               {
                                   try
                                   {
                                       return Convert.ToInt64(p.Field<string>("sl"));
                                   }
                                   catch (Exception e)
                                   {
                                       return 0;
                                   };
                               }),
                               OnlineTime = s.Sum(p =>
                               {
                                   try
                                   {
                                       return Convert.ToInt64(p.Field< string>("OnlineTime"));
                                   }
                                   catch (Exception e)
                                   {
                                       return 0;
                                   };
                               }),
                               onlinecount = s.Sum(p =>
                               {
                                   try
                                   {
                                       return Convert.ToInt64(p.Field<string>("onlinecount"));
                                   }
                                   catch (Exception e)
                                   {
                                       return 0;
                                   };
                               }),
                           };
            rowtotal.ToList().ForEach(p => dtreturns.Rows.Add(p.BMDM, p.Time, p.DevType, p.HandleCnt, p.CXCNT, p.FileSize, p.SCL, p.GFSCL, p.sl, p.OnlineTime, p.onlinecount));



            context.Response.Write(JSON.DatatableToDatatableJS(dtreturns, ""));

        }



        public class entityStruct
        {
            public string BMDM;
            public string SJBM;
        }

        public IEnumerable<entityStruct> GetSonID(string p_id)
        {
            try
            {
                var query = (from p in allEntitys.AsEnumerable()
                             where (p.Field<string>("SJBM") == p_id)
                             select new entityStruct
                             {
                                 BMDM = p.Field<string>("BMDM"),
                                 SJBM = p.Field<string>("SJBM")
                             }).ToList<entityStruct>();
                return query.ToList().Concat(query.ToList().SelectMany(t => GetSonID(t.BMDM)));
            }
            catch (Exception e)
            {
                return null;
            }

        }

        public class gps
        {
            public string BMDM;
            public DateTime Time;
            public string DevType;
            public Int64 HandleCnt;
            public Int64 CXCNT;
            public Int64 FileSize;
            public double SCL;
            public double GFSCL;
            public Int32 sl;
            public Int64 OnlineTime;
            public Int32 onlinecount;
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