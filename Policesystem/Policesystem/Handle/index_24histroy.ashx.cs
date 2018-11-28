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
                    dtEntitys = SQLHelper.ExecuteRead(CommandType.Text, "SELECT BMDM,SJBM from [Entity] where SJBM ='" + BMDM + "'", "11");
                    histroyreal = SQLHelper.ExecuteRead(CommandType.Text, "SELECT BMDM,[Time],DevType,count(ID) sl,SUM(OnlineTime) OnlineTime,SUM(HandleCnt) HandleCnt,SUM(CXCNT) CXCNT,SUM(FileSize) FileSize,SUM(SCL) SCL,SUM(GFSCL) GFSCL FROM [dbo].[StatsInfo_RealTime] WHERE BMDM <> ''  GROUP BY BMDM,[Time],DevType ORDER BY BMDM,[DevType],[TIME]", "histroyreal");
                    break;
                case "331001000000":
                case "331002000000":
                case "331003000000":
                case "331004000000":
                    dtEntitys = SQLHelper.ExecuteRead(CommandType.Text, "SELECT BMDM,SJBM from [Entity] where SJBM ='" + BMDM + "'", "11");
                    histroyreal = SQLHelper.ExecuteRead(CommandType.Text, "SELECT BMDM,[Time],DevType,count(ID) sl,SUM(OnlineTime) OnlineTime,SUM(HandleCnt) HandleCnt,SUM(CXCNT) CXCNT,SUM(FileSize) FileSize,SUM(SCL) SCL,SUM(GFSCL) GFSCL FROM [dbo].[StatsInfo_RealTime] WHERE BMDM <> ''  GROUP BY BMDM,[Time],DevType ORDER BY BMDM,[DevType],[TIME]", "histroyreal");
                    break;
                default:
                    dtEntitys = SQLHelper.ExecuteRead(CommandType.Text, "SELECT BMDM,SJBM from [Entity] where BMDM ='" + BMDM + "'", "11");
                    histroyreal = SQLHelper.ExecuteRead(CommandType.Text, "SELECT BMDM,[Time],DevType,count(ID) sl,SUM(OnlineTime) OnlineTime,SUM(HandleCnt) HandleCnt,SUM(CXCNT) CXCNT,SUM(FileSize) FileSize,SUM(SCL) SCL,SUM(GFSCL) GFSCL FROM [dbo].[StatsInfo_RealTime] WHERE BMDM <> ''  GROUP BY BMDM,[Time],DevType ORDER BY BMDM,[DevType],[TIME]", "histroyreal");
                    break;
            }

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

            for (int i1 = 0; i1 < dtEntitys.Rows.Count; i1++)
            {
                var entityids = GetSonID(dtEntitys.Rows[i1]["BMDM"].ToString());
                List<string> strList = new List<string>();

                strList.Add(dtEntitys.Rows[i1]["BMDM"].ToString());
                foreach (entityStruct item in entityids)
                {
                    strList.Add(item.BMDM);
                }
      
               var  rows = from p in histroyreal.AsEnumerable()
                       where strList.ToArray().Contains(p.Field<string>("BMDM"))
                       select p;

                foreach (var item in rows)
                {
                    DataRow dr = dtreturns.NewRow();

                    dr["BMDM"] = dtEntitys.Rows[i1]["BMDM"].ToString();
                    dr["Time"] = item["Time"].ToString();
                    dr["DevType"] = item["DevType"].ToString();
                    dr["HandleCnt"] = item["HandleCnt"].ToString();
                    dr["CXCNT"] = item["CXCNT"].ToString();
                    dr["FileSize"] = item["FileSize"].ToString();
                    dr["SCL"] = item["SCL"].ToString();
                    dr["GFSCL"] = item["GFSCL"].ToString();
                    dr["sl"] = item["sl"].ToString();
                    dr["OnlineTime"] = item["OnlineTime"].ToString();
                    dtreturns.Rows.Add(dr);
                }

            }

            var rowtotal = from p in dtreturns.AsEnumerable()
                           group p by new { Time = p.Field<string>("Time"), DevType = p.Field<string>("DevType") }
                   into s
                           select new
                           {
                               BMDM = "total",
                               Time = s.Key.Time,
                               DevType = s.Key.DevType,
                               HandleCnt = s.Sum(p => {
                                   try
                                   {
                                       return Convert.ToInt32(p.Field<string>("HandleCnt"));
                                   }
                                   catch (Exception e)
                                   {
                                       return 0;
                                   };
                               }),
                               CXCNT = s.Sum(p => {
                                   try
                                   {
                                       return Convert.ToInt32(p.Field<string>("CXCNT"));
                                   }
                                   catch (Exception e)
                                   {
                                       return 0;
                                   };
                               }),
                               FileSize = s.Sum(p => {
                                   try
                                   {
                                       return Convert.ToInt32(p.Field<string>("FileSize"));
                                   }
                                   catch (Exception e)
                                   {
                                       return 0;
                                   };
                               }),
                               SCL = s.Sum(p => {
                                   try
                                   {
                                       return Convert.ToDouble(p.Field<string>("SCL"));
                                   }
                                   catch (Exception e)
                                   {
                                       return 0;
                                   };
                               }),
                               GFSCL = s.Sum(p => {
                                   try
                                   {
                                       return Convert.ToDouble(p.Field<string>("GFSCL"));
                                   }
                                   catch (Exception e)
                                   {
                                       return 0;
                                   };
                               }),
                               sl = s.Sum(p => {
                                   try
                                   {
                                       return Convert.ToInt64(p.Field<string>("FileSize"));
                                   }
                                   catch (Exception e)
                                   {
                                       return 0;
                                   };
                               }),
                               OnlineTime = s.Sum(p => {
                                   try
                                   {
                                       return Convert.ToInt64(p.Field<string>("OnlineTime"));
                                   }
                                   catch (Exception e)
                                   {
                                       return 0;
                                   };
                               })
                           };
            rowtotal.ToList().ForEach(p => dtreturns.Rows.Add(p.BMDM, p.Time, p.DevType, p.HandleCnt, p.CXCNT, p.FileSize, p.SCL, p.GFSCL, p.sl, p.OnlineTime));



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

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}