package spark.poc;


import org.apache.commons.io.FileUtils;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.api.java.function.FlatMapFunction;
import org.apache.spark.api.java.function.Function2;
import org.apache.spark.api.java.function.PairFunction;
import scala.Tuple2;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class CharacterCounterSparkJob {

    public static void main(String[] args) throws IOException {
        Date start = new Date();

        SparkConf conf = new SparkConf().setAppName("Character Counter")
                                         .setMaster("local[4]");

        JavaSparkContext context = new JavaSparkContext(conf);

        FileUtils.deleteDirectory(new File("output"));

        JavaRDD<String> lines = context.textFile("./data1.txt");
        // Transform with a flat map  "hello world" => h,e,l,l,o, ,w,o,r,l,d
        List<Tuple2<Character, Integer>> collect = lines.flatMap(new FlatMapFunction<String, Character>() {
            @Override
            public Iterable<Character> call(String s) throws Exception {
                List<Character> list = new ArrayList<Character>();
                for (int len = 0; len < s.length(); len++) {
                    list.add(s.charAt(len));
                }
                return list;
            }
        // Transform h,e,l,l,o => (h,1), (e,1), (l,1), (l,1),(o,1)
        }).mapToPair(new PairFunction<Character, Character, Integer>() {
            @Override
            public Tuple2<Character, Integer> call(Character character) throws Exception {
                return new Tuple2(character, 1);
            }
        // See how l has 2?
        // (h,1), (e,1), (l,1), (l,1),(o,1) => (h,1), (e,1), (l,2), (o,1)
        }).reduceByKey(new Function2<Integer, Integer, Integer>() {
            @Override
            public Integer call(Integer v1, Integer v2) throws Exception {
                return v1 + v2;
            }
        // Return a list of K,V pairs
        }).collect();

        for(Tuple2<Character, Integer> tuple : collect) {
            System.out.println(tuple._1() + " => " + tuple._2());
        }

        Date end = new Date();
        System.out.println("Took " + (end.getTime() - start.getTime())/1000 + " seconds");

    }
}
